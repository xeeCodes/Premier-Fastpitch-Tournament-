const Player= require('../models/playerRegisterationModel');
const Event = require('../models/eventModel');
const generateToken = require('../utils/jwt');

//event controller 

const playerInfo = async(req,res) => {

    try {


        const {playerId,firstName,lastName,graduationYear,primaryPosition,guardianEmail,password } = req.body;
        const existing = await Player.findOne({ guardianEmail });


        if(!playerId || !firstName || !lastName || !graduationYear || !primaryPosition || !guardianEmail || !password){

            return res.status(400).json({message:"Please fill all th required fields!"});
        }
        if (password.length < 6) {
  return res.status(400).json({ message: "Password must be at least 6 characters" });
}

        if (isNaN(graduationYear) || graduationYear < 1900 || graduationYear > 2100) {
  return res.status(400).json({ message: "Invalid graduation year" });
}

if (existing) return res.status(400).json({ message: "Email already registered" });

const activeEvent = await Event.findOne({}).sort({ date: -1 });

      if (!activeEvent) {
  return res.status(400).json({ message: "No active event found" });
}
const eventId = activeEvent.eventId;


        const newPLayer = await Player.create({playerId,firstName,lastName,graduationYear,primaryPosition,guardianEmail,password});
        const event =await Event.findOne({eventId});

        event.players.push(newPLayer._id);
        await event.save();

        newPLayer.events.push(event._id);
        res.json(newPLayer);
console.log("Player success");
        
    } catch (error) {

         if (error.code === 11000) {
      const field = Object.keys(error.keyValue);
      return res.status(400).json({
        message: `The value for ${field} must be unique. A document with this ${field} already exists.`
      });
    }
        console.log("I ma from event catch block");
        console.log(error.message);
    }
};


// login player 

const playerLogin = async (req,res,next) => {

    try {

        const {guardianEmail,password} = req.body;

         if(!guardianEmail || !password){

            return res.status(400).json({
                message:"Please fill in the require fields"
            });
        }



        const player =await Player.findOne({guardianEmail});


        if(player){

            res.status(201).json({
                guardianEmail,
                password,
                token:generateToken(player.id),
            })
        }
        else{
            res.status(400).json({
                message:"Invalid email or password"
            });
        }
    } catch (error) {
        

        next(error);
    }
}

// show all players

const allPlayers = async (req,res,next) => 
{
    try {

        const teamList = await Player.find({});

        return res.status(201).json(
            teamList
        );
        
    } catch (error) {
         
        console.log(error.message);
        next(error);
    }
}

// get player by id

const singlePlayer = async (req,res,next) =>{


    try {

        const playerId = Number(req.params.id);

        const player = await Player.findOne({playerId});

        if(!player){

          return res.status(400).json({
                message:"Sorry! invalid id"
            });
        }

            res.status(201).json(player);
        
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

//updating the player

const updatePlayer = async (req,res) => {

try {

const playerId = req.params.id;
        const player = await Player.findOne({playerId});


          const {firstName,lastName,graduationYear,primaryPosition,guardianEmail} = req.body;

        console.log(playerId);
        if(!player){
            return res.status(404).json({
                message:"No player with this id"
            });
        }
        else{
            

                player.firstName=firstName;
                                player.lastName = lastName;
                player.graduaionYear=graduationYear,
                player.primaryPosition=primaryPosition;
                player.guardianEmail=guardianEmail;

const updatedPlayer = await player.save();
res.json(updatedPlayer);
            
        }
       
    
} catch (error) {

    console.log(error.message);
    next(error);
    
}
}

//delete a player 

const delPlayer = async (req,res,next) => {



    try {

        const playerId =req.params.id;
       

    const player =await Player.findOne({playerId});

    if(!player){
        return res.status(404).json({
            message:"No player with this id"
        });
    }   



       
        await player.deleteOne();       

        res.status(201).json({
 message: "Note Removed"

            });
        

        
        
    } catch (error) {

        console.log(error.message);
        next(error);
        
    }
}


module.exports = {playerInfo,playerLogin,allPlayers,singlePlayer,updatePlayer,delPlayer};
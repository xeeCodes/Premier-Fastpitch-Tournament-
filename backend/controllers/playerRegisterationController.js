const Player= require('../models/playerRegisterationModel');
const Event = require('../models/eventModel');
const generateToken = require('../utils/jwt');
const bcrypt =require('bcrypt');

//event controller 

const playerInfo = async(req,res) => {

    try {


        const {playerId,firstName,lastName,graduationYear,primaryPosition,guardianEmail,password } = req.body;



        if( !firstName || !graduationYear || !primaryPosition || !guardianEmail || !password){

            return res.status(400).json({message:"Please fill all th required fields!"});
        }
                const existing = await Player.findOne({ guardianEmail });


if(playerId){

    const check = await Player.findOne({playerId}).select("-password-__v");
    if(check){

        return res.status(400).json({
            message:"Id already exist"
        });
    }
}

if(firstName.length < 3 ){

    return res.status(400).json({
        message:"First name and last name must be at least 3 characters long"
    })
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(guardianEmail)) {
  return res.status(400).json({ message: "Invalid email format" });
}

        if (!password || password.length < 6) {
  return res.status(400).json({ message: "Password must be at least 6 characters" });
}

        if (!graduationYear || graduationYear < 1900 || graduationYear > 2100) {
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
        newPLayer.save();
        res.json(newPLayer);
        
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(guardianEmail)) {
  return res.status(400).json({ message: "Invalid email format" });
}

            if(password){

                const user = await Player.findOne({guardianEmail});
                if (!user) {
    return res.status(404).json({
        message: "User not found" 
    });
}

                const match = await bcrypt.compare(password,user.password);
                if(!match){

                    res.status(400).json({
                        message:"password is invalid"
                    });
                }
            }

        const player =await Player.findOne({guardianEmail}).select("-password-__v");


        if(player){

            res.status(201).json({
                guardianEmail,
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

        const playerList = await Player.find({}).select("-password-__v");


        if (!playerList || playerList.length === 0) {
  return res.status(200).json({
    message: "No player found",
  });
}

        return res.status(201).json(
            playerList
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

const updatePlayer = async (req,res,next) => {

try {

   

const playerId = req.params.id;

        const player = await Player.findOne({playerId}).select("-passwod-__v");
 if(!player){
            return res.status(404).json({
                message:"No player with this id"
            });
        }

          const {firstName,lastName,graduationYear,primaryPosition,guardianEmail} = req.body;

       if ((firstName && firstName.length < 2) || (lastName && lastName.length < 3)) {
      return res.status(400).json({ message: "Name is too short" });
    }


        if (guardianEmail !== player.guardianEmail) {
        const emailExists = await Player.findOne({ guardianEmail });
        if (emailExists) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(guardianEmail)) {
  return res.status(400).json({ message: "Invalid email format" });
}
        
            

                player.firstName=firstName;
                                player.lastName = lastName;
                player.graduaionYear=graduationYear,
                player.primaryPosition=primaryPosition;
                player.guardianEmail=guardianEmail;

const updatedPlayer = await player.save();
res.json(updatedPlayer);
            
        
       
    
} catch (error) {

    console.log(error.message);
    next(error);
    
}
}

//delete a player 

const delPlayer = async (req,res,next) => {



    try {

        if (!req.params.id) {
  return res.status(400).json({ message: "Team ID is required" });
}

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
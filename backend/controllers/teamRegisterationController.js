const Team= require('../models/teamRegisterationModel');
const Event = require('../models/eventModel');
const generateToken = require('../utils/jwt');


//event controller 

const teamInfo = async(req,res,next) => {

    try {

        const {name,coachName,ageGroup,state,coachEmail,password} = req.body;
        const existing = await Team.findOne({ coachEmail });

        if(!name || !coachName || !ageGroup || !state || !coachEmail || !password){

            return res.status(400).json({message:"Please fill all the required fields!"});
        }

        if (password.length < 6) {
  return res.status(400).json({ message: "Password must be at least 6 characters" });
}
if (existing) return res.status(400).json({ message: "Email already registered" });


        const activeEvent = await Event.findOne({}).sort({ date: -1 });

        if (!activeEvent) {
            return res.status(400).json({ message: "No active event found" });
        }

        const eventId = activeEvent.eventId;

        const newTeam = await Team.create({name,coachName,ageGroup,state,coachEmail,password});
        const event =await Event.findOne({eventId});

        event.teams.push(newTeam._id);
        await event.save();

        newTeam.events.push(event._id);
        res.json(newTeam);
        console.log("Team success");
        
    } catch (error) {

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue);
            return res.status(400).json({
                message: `The value for ${field} must be unique. A document with this ${field} already exists.`
            });
        }

        next(error);
    }
};


// login for team

const teamLogin = async (req,res,next) => {

    try {

        const {coachEmail,password} = req.body;

        if(!coachEmail || !password){

            return res.status(400).json({
                message:"Please fill in the require fields"
            });
        }

        const team =await Team.findOne({coachEmail});

        if(team){

            res.status(201).json({
                coachEmail,
                password,
                token:generateToken(team.id),
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



const allTeams = async (req,res,next) => 
{
    try {

        const teamList = await Team.find({});

        return res.status(201).json(
            teamList
        );
        
    } catch (error) {
         
        console.log(error.message);
        next(error);
    }
}



const singleTeam = async (req,res,next) =>{

    try {

        const teamId = Number(req.params.id);

        const team = await Team.findOne({teamId});

        if(!team){

          return res.status(400).json({
                message:"Sorry! invalid id"
            });
        }

        res.status(201).json(team);
        
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}



const updateTeam = async (req,res,next) => {

    try {

        const teamId = req.params.id;
        const team = await Team.findOne({teamId});

        const {name,coachName,ageGroup,state,coachEmail} = req.body;

        if(!team){
            return res.status(404).json({
                message:"No team with this id"
            });
        }
        else{

            team.name=name;
            team.coachName = coachName;
            team.ageGroup=ageGroup,
            team.state=state;
            team.coachEmail=coachEmail;

            const updatedTeam = await team.save();
            res.json(updatedTeam);
            
        }
       
    
    } catch (error) {

        console.log(error.message);
        next(error);
    
    }
}



const delTeam = async (req,res,next) => {

    try {

        const teamId =req.params.id;
        const team =await Team.findOne({teamId});

        if(!team){
            return res.status(404).json({
                message:"No team with this id"
            });
        }

        await team.deleteOne();       

        res.status(201).json({
            message: "Note Removed"
        });

    } catch (error) {

        console.log(error.message);
        next(error);
        
    }
}


module.exports = {teamInfo,teamLogin,allTeams,singleTeam,updateTeam,delTeam};

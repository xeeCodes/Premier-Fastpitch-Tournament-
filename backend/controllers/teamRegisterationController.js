const Team= require('../models/teamRegisterationModel');
const Event = require('../models/eventModel');
const Player =require("../models/playerRegisterationModel")
const generateToken = require('../utils/jwt');


//event controller 

const teamInfo = async(req,res,next) => {

    try {

        const {teamId,name,coachName,ageGroup,state,coachEmail,password,playerId} = req.body;
        const existing = await Team.findOne({ coachEmail });

        if(!teamId || !name || !coachName || !ageGroup || !state || !coachEmail || !password){

            return res.status(400).json({message:"Please fill all the required fields!"});
        }
if(teamId){

    const check = await Team.findOne({teamId}).select("-password-__v");
    if(check){

        return res.status(400).json({
            message:"Id already exist"
        });
    }
}
        if (!password || password.length < 6) {
  return res.status(400).json({ message: "Password must be at least 6 characters" });
}
if (existing) return res.status(400).json({ message: "Email already registered" });

if(name.length < 3 || coachName.length < 3){

    return res.status(400).json({
        message:"First name and last name must be at least 3 characters long"
    })
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(coachEmail)) {
  return res.status(400).json({ message: "Invalid email format" });
}

        const activeEvent = await Event.findOne({}).sort({ date: -1 });

        if (!activeEvent) {
            return res.status(400).json({ message: "No active event found" });
        }

        const eventId = activeEvent.eventId;
        

        const newTeam = await Team.create({teamId,name,coachName,ageGroup,state,coachEmail,password});

        if(playerId){

            const player = await Player.findOne({playerId}).select("-password-__v");
            newTeam.players.push(player._id);
            player.team.push(newTeam._id);
            await player.save();
        }
        const event =await Event.findOne({eventId});

        event.teams.push(newTeam._id);
        await event.save();

        newTeam.events.push(event._id);
        await newTeam.save();
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
if (!team) {
  return res.status(400).json({ message: "Invalid email or password" });
}


        if(team){

            res.status(201).json({
                team,
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

const teamList = await Team.find({}).select("-password -__v");

        if (!teamList || teamList.length === 0) {
  return res.status(200).json({
    message: "No teams found",
    teams: []
  });
}

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

        const team = await Team.findOne({teamId}).select("-password-__v");

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


        if (!req.params.id) {
  return res.status(400).json({ message: "Team ID is required" });
}

        const teamId = req.params.id;
        const team = await Team.findOne({teamId}).select("-password-__v"); 
         if(!team){
            return res.status(404).json({
                message:"No team with this id"
            });
        }       
        const {name,coachName,ageGroup,state,coachEmail} = req.body;


if ((name && name.length < 2) || (coachName && coachName.length < 3)) {
      return res.status(400).json({ message: "Name is too short" });
    }


        if (coachEmail !== team.coachEmail) {
        const emailExists = await Team.findOne({ coachEmail });
        if (emailExists) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }



            team.name=name;
            team.coachName = coachName;
            team.ageGroup=ageGroup,
            team.state=state;
            team.coachEmail=coachEmail;

            const updatedTeam = await team.save();
            res.json(updatedTeam);
            
        
       
    
    } catch (error) {

        console.log(error.message);
        next(error);
    
    }
}



const delTeam = async (req,res,next) => {

    try {


        if (!req.params.id) {
  return res.status(400).json({ message: "Team ID is required" });
}

        const teamId =req.params.id;
        const team =await Team.findOne({teamId});

        if(!team){
            return res.status(404).json({
                message:"No team with this id"
            });
        }

        await team.deleteOne();       

        res.status(201).json({
            message: "Team Removed"
        });

    } catch (error) {

        console.log(error.message);
        next(error);
        
    }
}


module.exports = {teamInfo,teamLogin,allTeams,singleTeam,updateTeam,delTeam};

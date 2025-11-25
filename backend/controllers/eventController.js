const Event= require('../models/eventModel');
const Player = require('../models/playerRegisterationModel');
//event controller 

const eventInfo = async(req,res) => {

    try {
        console.log("helllo i am from event controller.");

        const {eventId,name,date,location} = req.body;

        if(!eventId || !name || !date || !location){

            return res.status(400).json({message:"Please fill all th required fields!"});
        }

        

      if ((name.length < 3) || (location.length < 3) ) {
  return res.status(400).json({ message: "Name or event is short " });
}


        const newEvent = await Event.create({eventId,name,date,location});
        

        res.json(newEvent);
        console.log("hello! Iam from event controller");
console.log("event success");
        
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

// get al events

const eventList = async (req,res,next) => {
    try {

        const allEvents = await Event.find({});

        if(!allEvents || allEvents.length<=0){

            return res.status(200).json([]);
        }
        
        res.status(200).json(allEvents);
    } catch (error) {
        
        console.log(error.message);
        next(error);

    }
}

// get event by id:

const getEvent = async(req,res,next) =>{

    try {


       

        const id = req.params.id;


        const event =await Event.findOne({eventId:id});
 if(!event){

            return res.status(400).json({

                message:"No such id exist!"
            });
        }
        res.status(200).json(event);

       
        
    } catch (error) {

        next(error);
        
    }
}
// update an event

const eventUpdate = async(req,res,next) => {
    try {

        const id = req.params.id;

        const {eventId,name,date,location} =req.body;

        const event = await Event.findOne({eventId:id});

        if(!event){

            return res.status(400).json({

                message:"No event with such id"
            });
    }
        
    event.eventId=eventId;
    event.name=name;
    event.location=location;
    event.date=date;

    const updatedEvent =await event.save();

res.status(200).json(updatedEvent);

    } catch (error) {

      
        next(error);
        
    }
}

//delete event

const delEvent = async (req,res,next) => {
    try {
        
const eventId = Number(req.params.id);
const event = await Event.findOne({ eventId });


if(!event){

    return res.status(400).json({
        message:"No event found"
    });
}

await event.deleteOne();

res.status(200).json({
    message:"Event deleted"
});

    } catch (error) {

        console.log(error.message);
        next(error);
        
    }
}

// eventh having players

const playerEvent = async(req,res,next) => {
    try {


       

        const id = req.params.id;

        const event = await Event.findOne({eventId:id}).select("-teams -__v").populate("players");

        if(!event){

            res.status(400).json({
                message:"no such event"
            })
        }
        
        res.status(200).json({event});
    } catch (error) {

        next(error);
        
    }
}
//events having teams
const teamEvent = async(req,res,next) => {
    try {


       

        const id = req.params.id;

        const event = await Event.findOne({eventId:id}).select("-players -__v").populate("teams");

        if(!event){

            res.status(400).json({
                message:"no such event"
            })
        }
        
        res.status(200).json({event});
    } catch (error) {

        next(error);
        
    }
}

module.exports = {eventInfo,getEvent,playerEvent,teamEvent,eventList,delEvent,eventUpdate};
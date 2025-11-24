const Event= require('../models/eventModel');
const Player = require('../models/playerRegisterationModel');
//event controller 

const eventInfo = async(req,res) => {

    try {
        console.log("helllo i am from event controller.");

        const {eventId,name,date,location} = req.body;
        console.log(req.body);

        if(!eventId || !name || !date || !location){

            return res.status(400).json({message:"Please fill all th required fields!"});
        }

        

      

        const newEvent = await Event.create({eventId,name,date,location});
        

        res.json(newEvent);
        console.log("hello! Iam from event controller");
console.log("event success");
        
    } catch (error) {

         if (error.code === 11000) {
      // You can extract the duplicate field from the error details if needed
      const field = Object.keys(error.keyValue);
      return res.status(400).json({
        message: `The value for ${field} must be unique. A document with this ${field} already exists.`
      });
    }
        console.log("I ma from event catch block");
        console.log(error.message);
    }
};

// get event by id:

const getEvent = async(req,res,next) =>{

    try {

        const id = req.params.id;
        console.log("id of the event",id);


        const event =await Event.findOne({eventId:id});
console.log("event for the specific id: ",event);
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
// eventh having players

const playerEvent = async(req,res,next) => {
    try {

        const id = req.params.id;

        const event = await Event.findOne({eventId:id}).populate("players");

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

module.exports = {eventInfo,getEvent,playerEvent};
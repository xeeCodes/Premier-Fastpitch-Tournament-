const Player= require('../models/playerRegisterationModel');


//event controller 

const playerInfo = async(req,res) => {

    try {
        console.log("helllo i am from player controller.");

        const {firstName,lastName,graduationYear,primaryPosition,guardianEmail} = req.body;


        if(!firstName || !lastName || !graduationYear || !primaryPosition || !guardianEmail){

            return res.status(400).json({message:"Please fill all th required fields!"});
        }

        

      

        const newPLayer = await Player.create({firstName,lastName,graduationYear,primaryPosition,guardianEmail});

        res.json(newPLayer);
console.log("Player success");
        
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

module.exports = {playerInfo};
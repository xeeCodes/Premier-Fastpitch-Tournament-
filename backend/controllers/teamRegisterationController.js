const Team= require('../models/teamRegisterationModel');


//event controller 

const teamInfo = async(req,res,next) => {

    try {

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        console.log("helllo i am from team controller.");

        const {name,coachName,ageGroup,state,coachEmail,password} = req.body;


        if(!name || !coachName || !ageGroup || !state || !coachEmail || !password){

            return res.status(400).json({message:"Please fill all the required fields!"});
        }
if(!emailRegex.test(coachEmail)){
return res.status(400).json({message:"PLease enter valid email."});

}
        

      

        const newTeam = await Team.create({name,coachName,ageGroup,state,coachEmail,password});

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
  
        // console.log("I am from team catch block");
        // console.log(error.message);
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
        
    } catch (error) {
        
        next(error);
    }
}



module.exports = {teamInfo,teamLogin};
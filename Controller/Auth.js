const bcrypt = require('bcrypt');
const User = require('../Models/User');




//to interact with db i imported model

require("dotenv").config()

// Sign up route handler

exports.signup = async(req,res) =>
{
      try{
        //get data
        const { name, email, password, role } = req.body;

        // check if user already exist 
        //db interaction , so use await and use MODEL
        //find the value in "email" variable received from req.body matches with db entry
        const existingUser = await User.findOne({ email });

        if( existingUser)
        {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }
           
        
        // Secured password 
        let hashedPassword;
        try {
            
            
               // The bcrypt.hash() function takes two arguments:
              // The plain text password (password in this case): This is the user's password in its raw form.
             // The salt rounds (10 in this case): The salt rounds determine how many times the hashing process is applied, 
             // adding complexity to the hashing process. A higher number increases security but takes longer to compute.
            // The hash() function produces a hashed version of the password, which is a one-way encrypted string that 
           // cannot be reversed back to the original password.

          // The bcrypt.hash() function is asynchronous, meaning it doesn't block the execution of other code while 
          // hashing is in progress. The await keyword is used to pause the execution until the hashing is complete 
         // and then assigns the hashed password to the hashedPassword variable.

           //10 is the number of rounds
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) 
        {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        //Create User ,using create function (db interaction )
        //an entry is created in database of a person who is signing up

        let user = await User.create({
            name,email,password:hashedPassword,role
        });


        return res.status(200).json({
            success : true,
            message : "User Created Successfully",
            data : user
        });
    }

      catch(error){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Login false" 
        })
      }
}
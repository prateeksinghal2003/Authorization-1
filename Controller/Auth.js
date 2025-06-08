const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require("jsonwebtoken")





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
            message : "signup false" 
        })
      }
}


//iske baad postman pe gaye  sign up vala route dala 
//name ,email,password,role dallaaa
//mono db pe post kar diaaa  


// Login page 

exports.login = async (req,res) => {
    try
    {
        //extract data from request that client send to server during login
        const {email,password} = req.body;

        //verify email and password
        //if email and password does not contain anything
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message : "Please fill all the details carefully",
            })
        }

        // before login user must sign up -->toh vohi check kar na hain
        
        //jo email bheja  hai client ne vo verify karna hai whether it is available in database or not 
        let user = await User.findOne({email});

        //if not a registered user
        if(!user)
        {
            return res.status(401).json({
                success : false,
                message : "User must signup first",
            });
        }

         
        // Verify password & generate a JWT token

        


// bcrypt is a popular library used for hashing passwords securely.
// It ensures passwords are stored as hashed values, not in plain text, for better security.
// compare(password, user.password):

// bcrypt.compare() is a method that compares a plain text password (e.g., the one a user enters during login) 
// with a hashed password (e.g., the one stored in the database when the user signup).
// The function works by hashing the plain text password with the same algorithm and salt used for 
// the stored hash and then comparing the two.


// The plain text password provided by the user when attempting to log in.


// The hashed password retrieved from the database for the user.


// Since bcrypt.compare() is asynchronous (returns a Promise), you need to use await to pause execution until the comparison is complete.


// The if statement checks if the comparison result is true (passwords match) or false (passwords don't match). 
// If the result is true, the user is authenticated.

    const payload = {
                      email : user.email,
                      id : user._id,
                      role : user.role,
                    };

        if(await bcrypt.compare(password,user.password)){
            // password match  --->then do login
            //create a token ---read about it at last

            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn : "2h",
            });

                 // When you query data from MongoDB using Mongoose (e.g., User.find()), it returns a Mongoose document.
                // A Mongoose document is a special object that:
                // Contains the actual data (e.g., user details).
               // Includes helper methods (e.g., .save(), .updateOne(), .remove()).

             // Remove Mongoose-Specific Methods:

             // The .toObject() method removes Mongoose-specific methods and properties, leaving only the raw data.
            // The resulting object is a plain JavaScript object that can be safely used for manipulation or sent as a response.

            user = user.toObject();

            //user main token ki field  banakar token daal diaa
            user.token = token;

            //password hata dia from user object ,not from database
            user.password = undefined;


            // This sets the expiration date for the cookie.
            // Date.now() gives the current timestamp in milliseconds.
            // 3 * 24 * 60 * 60 * 1000 calculates the duration for 3 days in milliseconds:
            // 3 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds.
            // The expires property sets the cookie to expire exactly 3 days from the current time.
            // httpOnly:
            
            // This makes the cookie accessible only by the server, not by client-side JavaScript.

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true,
            }

            //read about it at last 
            //jab cookie se token retreive karna hoo , tab  isko uncomment karooo    

            //creating cookie storing token value
            res.cookie("token",token,options).status(200).json({
                success : true,
                token,
                user,
                message:"User logged in successfully"
            });

        //     res.status(200).json({
        //         success : true,
        //         token,
        //         user,
        //         message:"User loged in successfully"
        //     });
    }

        //if password does not match
        else {
            
            return res.status(403).json({
                success : false,
                message : "Password does not match",
            })
        }
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Login false" 
        })
    }
}

//iske baad postman pe gaye aur login vala route dala   ----->POST

//     {
    
//         "email"   : "123@gmail.com",
//        "password" : "abdce"
      
//    }




// jwt.sign(): This is a function that creates the token.
// It takes three inputs:
// Payload: This is the user data you want to include in the token.
// Secret Key: A secret password (hidden in an environment variable like process.env.JWT_SECRET) 
// to ensure only your server can validate the token.
// Options: Additional settings, like when the token should expire (expiresIn: "2h" means the token will expire in 2 hours).


// What’s Inside the Token?
// A JWT is divided into three parts:

// Header: Metadata about the token (e.g., algorithm and type).

// Payload: The data you added (e.g., userId, role).

// Signature: A secure hash created using the payload and your secret key. This ensures the token hasn’t been tampered with.


// How Is It Used?
// Login: When a user logs in, you create a token using their data.
// Example: { userId: 101, role: "admin" }.
// Send Token: You send the token to the user (e.g., in a response or cookie).
// Verify Token: For future requests, the user sends the token back (e.g., in the Authorization header).
// Your server uses the secret key to verify the token and extract the user’s info from the payload.




//------------------------------------------------Cookie----------------------------------------------------------------------


// This is the response object in Express. It’s used to send a response back to the client.
// cookie("token", token, options):

// Purpose: This sets a cookie named "token" with the value of the JWT token on the client’s browser.
// Arguments:
// "token": The name of the cookie.
// token: The JWT created using jwt.sign() (from your earlier example).
// options: Configuration for the cookie (e.g., how long it lasts, security settings).
// .status(200):

// This sets the HTTP status code to 200, indicating a successful operation.
// .json({...}):

// This sends a JSON response to the client with the following data:
// success: A flag indicating the operation was successful.
// token: The JWT token (for client use, e.g., in HTTP headers).
// user: The user object (likely fetched from the database).
// message: A success message.
//

//-----------------------------FLOW
// Login: The user logs in by providing credentials (e.g., email and password).
// Token Generation: The server generates a JWT (token) after verifying the credentials.
// Set Cookie: The server sends the JWT back to the client as a cookie using res.cookie().
// Subsequent Requests:
// The client automatically sends the cookie (token) with every request.
// The server verifies the JWT from the cookie to authenticate the user.
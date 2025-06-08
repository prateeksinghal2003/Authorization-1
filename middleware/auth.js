// This middleware is responsible for authenticating the user by verifying the JWT token sent in the request. Here's a breakdown of its logic:

// Key steps:
// Token Extraction:

// It checks for the JWT token in three possible places:
// req.body.token: The body of the request (for POST or PUT requests).
// req.cookies.token: The cookies (if the token is stored in a cookie).
// req.header("Authorization"): The Authorization header (in the format Bearer <token>).
// The first token found is used for verification.

// Token Missing Check:

// If no token is provided in any of the above places, the middleware sends a 401 Unauthorized response with a "Token Missing" message.
// Token Verification:

// If a token is found, it uses jwt.verify() to verify the token. This step:
// Decodes the token: Extracts the payload.
// Verifies the signature: Ensures the token was not tampered with, using process.env.JWT_SECRET (the secret key).
// If the token is valid, the payload is extracted and added to req.user.
// If verification fails (e.g., the token is expired or invalid), it sends a 401 Unauthorized response with a "Token is invalid" message.
// Next Middleware:

// If the token is successfully verified, it calls next() to pass control to the next middleware or route handler.
// 2. isStudent Middleware
// This middleware ensures that only users with the role of "Student" can access the protected route.

// Key steps:
// Role Check:

// It checks if the user's role (req.user.role) is "Student". This data comes from the decoded JWT token stored in req.user by the auth middleware.
// Access Denied:

// If the role is not "Student", the middleware sends a 401 Unauthorized response with a message indicating that the route is restricted to students.
// Next Middleware:

// If the role is "Student", it calls next() to pass control to the next middleware or route handler.






const jwt = require("jsonwebtoken")
require("dotenv").config();

//next is used for traversing through  several middlewares
exports.auth = (req, res, next) => {
    try {

        console.log("Here-------------------------------");
        console.log("req yaha " , req);
        //extract jwt token 

         console.log("Body", req.body.token);
         console.log("Cookies", req.cookies.token);
        // console.log("Header", req.header("Authorization").replace("Bearer", " "));

        // const token = req.body.token;
        // const token = req.cookie.token 

        //possible places for token--->token is now fetched

        //pehle ye kiya tha
        //const token = req.body.token ;

        //updated way to get token     
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

          // this line of code is retrieving a token that may have been sent to the server in various ways. Here's a detailed breakdown:

         // req.body.token:

         // This checks if the token was sent in the body of the HTTP request.
        // For example, in a POST request, the client might send a token in the body as JSON.
       // req.cookies.token:

// If the token wasn't found in the body, it checks if it's stored in the cookies.
// Cookies are small pieces of data sent by the server and stored on the client side. They are often used to keep track of user sessions.
// req.header("Authorization").replace("Bearer ", ""):

//most safe approach
// This checks if the token was sent in the Authorization header of the HTTP request.
// The Authorization header typically contains a token in the format Bearer <token>.
// The replace("Bearer ", "") part removes the "Bearer " prefix, leaving just the token itself.


        //if token not present 
        if(!token || token === undefined) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        // verify the token 
        try {

            //token main se values nikalenge
            //It extracts the payload that was encoded in the token when it was created

//          It:
//            Decodes the token: Extracts the information stored in the payload.
//            Verifies the signature: Ensures the token hasn’t been tampered with by using the secret key (process.env.JWT_SECRET).

//         Inputs:

//            token: The JWT string, typically sent by the client (e.g., from cookies, HTTP headers).
//            process.env.JWT_SECRET: The secret key used to sign the token during its creation. 
 
//         Output:

//           If the token is valid and verified, it returns the decoded payload (a plain JavaScript object).
//           If the token is invalid or has expired, it throws an error.

            const payload = jwt.verify(token, process.env.JWT_SECRET);

            console.log(payload)

            //request.user ke andar payload dalooo 
            //token se role nikal kar isStudent vale middleware pe check karenge
            
            //you are appending "user" property in req object 
            req.user = payload; 

        } catch (e) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}

exports.isStudent = (req, res, next) => {
    try {
        //no need of success vala response ,because route main already included hain
        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for students you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}



 exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for Admins,you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}


//postman par gayee ->middleware vaali routes daali 
//http://localhost:4000/api/v1/admin

// {
    
     
// "token" :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyM0BnbWFpbC5jb20iLCJpZCI6IjY3OGEyZWI2YjZiOGNlOGU1MTkwNjY2MCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczNzEyMTg2OCwiZXhwIjoxNzM3MTI5MDY4fQ.zSvb808vygCpx-nTPxv5xb-r9EMM4KVqVD_CTsuEOqo"
// }
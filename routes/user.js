const express = require('express')
const router = express.Router();

const User = require("../Models/User");


//importing controller

const {login,signup} = require("../Controller/Auth");

//importing middleware
const { auth, isAdmin, isStudent } = require("../middleware/auth")


router.post("/signup",signup); 
router.post("/login", login);


//Protected route for Student
// "/student"  ke badd vo middleware likhna jo uss route se introduce ho sakte hain aur controller se pehle middleware vala part chalega

//auth middleware checks for authorization
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Student"           
    })                                                                         
});



// Protected Route for Admin 
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Admin"
    })
});


//Testing route for authenticity
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Testing route is successful"
    })
})




//kuch khaaas need nahi hain
// router.get("/getEmail", auth, async (req, res) => {
//     try{    
//         //req.user ke andar payload already hain
//         const id = req.user.id;
//         console.log(id)
//         const user = await User.findOne({_id:id});

//         res.status(200).json({
//             success : true,
//             user : user,
//             message : "Welcome to Email Route"
//         })
//     }       
//     catch(err){
//         res.status(500).json({
//             success : false,
//             message : err.message
//         })
//     } 
// })

module.exports = router;



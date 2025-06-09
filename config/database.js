const mongoose = require('mongoose');
require("dotenv").config()

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(() => {
        console.log("Database Connection established")
    })
    .catch((err) => {
        // console.error(err)
        console.log("Connection Issues with Database");
        process.exit(1);
    })
}



// This code is responsible for connecting your Node.js application to a MongoDB database using Mongoose.
// mongoose is a popular ODM (Object Data Modeling) library for MongoDB and Node.js. 
// It lets you define schemas and interact with MongoDB in an organized way.

// require("dotenv").config() loads environment variables from a .env file into process.env. 
// So process.env.DATABASE_URL will now hold the actual MongoDB connection string.

// This defines and exports a function connect.

// Inside it, mongoose.connect(...) connects to the database using the URL from the .env file.


// If the connection is successful, it logs: "Database Connection established".

// If there's an error, it logs: "Connection Issues with Database", 
// and stops the process with process.exit(1) to prevent the app from running without a DB connection.


// ODM stands for Object Data Modeling, 
// and it refers to a technique (or a library) that allows you to interact with a database using JavaScript objects.
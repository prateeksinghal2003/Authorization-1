//we need name and schema
//for schema we need mongoose

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    //read about enum at last
    enum: ["Admin", "Student", "Visitor"],
  },
});

module.exports = mongoose.model("User", userSchema);

//In programming, enum stands for enumeration, which is a special data type that defines a set of predefined, 
// fixed values that a variable can have. It is used to restrict a field or variable to specific allowed values.
//The enum keyword specifies that the field role can only accept one of the values in the list: 
// "Admin", "Student", or "Visitor". If someone tries to assign any other value to the role field (like "Teacher" or "Guest"), 
// it will throw an error because the value is not part of the allowed enum.
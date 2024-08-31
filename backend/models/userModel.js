const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true,
    },

    
    email:{
        type:String,
        require:true,
    },
    mobile:{
        type:String,
        require:true,
    },
   
    password:{
        type:String,
        require:true,
    },
    is_admin:{
        type:Number,
        require:true
    },
    is_varified:{
        type:Number,
        default:0
    },
    verificationToken:String,
    verificationTokenExpiry:Date,
    token: String,
    expiryToken: Date, // New field for token expiry
    image: String, // Add image field

});

module.exports = mongoose.model('User',userSchema);
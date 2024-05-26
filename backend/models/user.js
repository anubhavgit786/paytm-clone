const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
{
    username:
    {
        type:String,
        required:[true, 'A user must have an email'], 
        unique :true,
        trim: true, 
        lowercase:true,
        validate:[validator.isEmail, 'Please provide a valid email'], 

    },
    password:
    {
        type: String,
        required:[true, 'A user must have a password'],
        minLength:6
    },
    firstname:
    {
        type:String, 
        required:[true, 'A user must have a first name'],
        trim:true,
        maxLength:50
    },
    lastname:
    {
        type:String, 
        required:[true, 'A user must have a last name'],
        trim:true,
        maxLength:50
    }
}, 
{
    timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;
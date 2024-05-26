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

userSchema.methods.getToken = function() 
{
    const token = jwt.sign({ id:this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPRES_IN });
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
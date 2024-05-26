const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    passwordConfirm: 
    {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: 
        {
          // This only works on CREATE and SAVE!!!
          validator: function(el) 
          {
            return el === this.password;
          },

          message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date, 
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



userSchema.pre('save', async function(next) 
{
    try 
    {
        if (!this.isModified('password')) return next();

        if(this.isNew)
        {
            const userCount = await this.constructor.countDocuments({ username: this.username });
            
            if(userCount)
            {
                throw new Error("Email already taken / Invalid inputs.");
            }
        }

        const saltRounds = 10;
        const salt  = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        
        if(!this.isNew)
        {
            this.passwordChangedAt = Date.now() - 1000;
        }

        this.passwordConfirm = undefined;
        return next();
    } 
    catch (error) 
    {
        next(error);
    }
});

userSchema.methods.getToken = function() 
{
    const token = jwt.sign({ id:this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPRES_IN });
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
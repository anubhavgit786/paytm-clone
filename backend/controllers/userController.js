const User = require('../models/user');
const zod = require('zod');
const bcrypt = require('bcrypt');

const signupBody = zod.object(
{
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password: zod.string(),
});

module.exports.signUp = async (req, res)=>
{
    try 
    {
        const { success } = signupBody.safeParse(req.body);
        if(!success)
        {
            return res.status(411).json({ message : "Email already taken / Invalid inputs." });
        }    

        const existingUser = await User.findOne({ username: req.body.username });

        if(existingUser)
        {
            return res.status(411).json({ message : "Email already taken / Invalid inputs." });
        }

        const saltRounds = 10;
        const salt  = await bcrypt.genSalt(saltRounds);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = await User.create(
        {
            username: req.body.username,
            password, 
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        const token = user.getToken();

        return res.status(200).json({ message : "User created successfully", token  });

    } 
    catch (error) 
    {
        console.log(error);
    }
}
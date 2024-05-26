const User = require('../models/user');
const zod = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports.protect = async (req, res, next) =>
{
    try 
    {
        //Checking the header for bearer token
        let token;
    
        //Express automatically converts all the header fields to lowercase e.g. Authorization will be converted to lowercase authorization 
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            token = req.headers.authorization.split(" ")[1];
        }
        else if(req.cookies.jwt)
        {
            token = req.cookies.jwt
        }
 
        //Checking the token if the token exists
 
        if(!token)
        {
            return res.status(411).json({ message : "You are not logged in. Please login to get access." });
        }

        //Checking the token if the token is valid
    
        // It will return payload data i.e. { id: '66212e2cf78b9635665dbde8', iat: 1713450540, exp: 1721226540 }
        //Here iat means token issued at
        //wrong token and expired token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET); 
        
        //Checking if the user exists by using information provided by decoded data
        const user = await User.findById(decoded.id);
        if(!user)
        {
            return res.status(401).json({ message : "The user belonging to this token no longer exists" });
        }

        //TODO: Implement if user has changed password

        req.user = user;
        next();
    } 
    catch (error) 
    {
        console.log(error);
    }
}

const User = require('../models/user');
const Account = require('../models/account');

const zod = require('zod');

module.exports.signUp = async (req, res)=>
{
    try 
    {
        const user = await User.create(
        {
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        await Account.create(
        {
            userID: user.id,
            balance: 1 + Math.random() * 10000
        });

        const token = user.getToken();

        return res.status(200).json({ message : "User created successfully", token  });

    } 
    catch (error) 
    {
        console.log(error);
        return res.status(411).json({ message : error.message });  
    }
}



module.exports.updatePassword = async (req, res)=>
{
    try 
    {
        //Get user from collection
        const user = await User.findById(req.user.id).select('+password');
    
        //check if posted current password is valid
        const isMatch = await user.comparePassword(req.body.passwordCurrent, user.password);

        if(!isMatch)
        {
            return res.status(401).json({ message : "Invalid login credentials" });
        }

        //if so update password
    
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        const token = user.getToken();

        return res.status(200).json({ message : "User password updated successfully", token  });
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(411).json({ message : error.message }); 
    }
}

const updateBody = zod.object(
{
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
});

module.exports.updateUser = async (req, res)=>
{
    try 
    {
        const { success } = updateBody.safeParse(req.body);
        if(!success)
        {
            return res.status(411).json({ message : "Error while updating user"  });
        }
        
        await User.updateOne(req.body, { id : req.user.id });

        return res.status(200).json({ message : "User updated successfully"  });
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(411).json({ message : error.message }); 
    }
}


module.exports.getUsers = async (req, res)=>
{
    try 
    {
        const filter = req.query.filter || "";
        const users = await User.find({
            $or: [
              { firstname: { "$regex": filter, "$options": "i" } },
              { lastname: { "$regex": filter, "$options": "i" } }
            ]
          }).select('firstname lastname username _id');

        return res.status(200).json({ message : "Users fetched successfully", users  });

    } 
    catch (error) 
    {
        console.log(error);
        return res.status(411).json({ message : error.message });
    }
}
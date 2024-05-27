const Account = require('../models/account');
const mongoose = require('mongoose');

module.exports.getBalance = async (req, res) =>
{
    try 
    {
        const account = await Account.findOne({ userID: req.user.id });
        
        return res.status(200).json({ balance: account.balance  });
    } 
    catch (error) 
    {
        console.log(error);
    }
}

module.exports.transferBalance = async (req, res) =>
{
    try 
    {
        const session = await mongoose.startSession();
        const { amount, to } = req.body;
        
        //Fetch the accounts within the transaction

        const account = await Account.findOne({ userID: req.user.id }).session(session);

        if(!account || account.balance < amount)
        {
            await session.abortTransaction();
            return res.status(400).json({ message : "Insufficient Balance" });
        }

        const toAccount = await Account.findOne({ userID: to }).session(session);

        if(!toAccount)
        {
            await session.abortTransaction();
            return res.status(400).json({ message : "Invalid Account" });
        }

        //Perform the transaction
        await Account.updateOne({ userID: req.user.id }, { $inc : { balance: -amount }}).session(session);
        await Account.updateOne({ userID: to }, { $inc : { balance: amount }}).session(session);

        //Commit the transaction
        await session.commitTransaction();

        return res.status(200).json({ message : "Transferred successfully" });

    } 
    catch (error) 
    {
        console.log(error);
    }
}
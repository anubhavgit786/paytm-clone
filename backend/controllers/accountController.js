const Account = require('../models/account');

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
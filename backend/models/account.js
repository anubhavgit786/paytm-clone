const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
{
    userID:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:[true, 'Account must have a user']
    },
    balance:
    {
        type: Number,
        required:[true, 'Account must have a balance'],
    }
}, 
{
    timestamps: true
});


const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
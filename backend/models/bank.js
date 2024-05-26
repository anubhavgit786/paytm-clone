const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema(
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


const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
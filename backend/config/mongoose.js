const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error : '));
db.once('open', function()
{
    console.log('successfully connected to database');
});
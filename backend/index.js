const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require("express");
const cors = require("cors");

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 8000;

const app = express();

const db = require('./config/mongoose');

app.use(cors());

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1', require('./routes/index'));
//start the server
app.listen(port,hostname, function(err){
    if(err)
    {
        console.log(err);
        return;
    }

    console.log(`Server is up and running at http://${hostname}:${port}`);
});

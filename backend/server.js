const express = require('express');
const dotenv = require('dotenv');
const app = express();


//configuration
dotenv.config();

app.get('/',(req,res) => {

    res.send("API is running!");
})

const port = process.env.PORT || 3200;
app.listen(port,() => console.log(`Server is  running on port ${5000}.`));
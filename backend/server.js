const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const connectdb= require('./config/db');
const eventRoutes = require('./routes/eventRoute');
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const ErrorHandler = require('./midleware/errorMidddleware')
const app = express();

app.use(cors());

//configuration
dotenv.config();
connectdb();

app.use(express.json());

app.get('/',(req,res) => {

    res.send("API is running!");
})

app.use('/api/event',eventRoutes);
app.use('/api/player',playerRoutes);
app.use('/api/team',teamRoutes);

app.use(ErrorHandler);



const port = process.env.PORT || 3200;
app.listen(port,() => console.log(`Server is  running on port ${port}`));
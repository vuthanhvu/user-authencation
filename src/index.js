const signale = require('signale');
require('dotenv').config();

const app = require('./app');
const database = require('./config/database');

//connect database
database.connect(process.env.MONGODB_URI);

const port = process.env.port || 3000;
app.listen(port , () => {
    signale.success(`Server's running at ${port}`);
})

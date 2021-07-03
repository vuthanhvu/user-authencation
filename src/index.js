const dotevn = require('dotenv');
const app = require('./app');
const signale = require('signale'); 

const port = process.env.port || 3000;
app.listen(port , () => {
    signale.success(`Server's running at ${port}`);
})

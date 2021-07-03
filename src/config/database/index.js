const mongoose = require('mongoose');
const signale = require('signale');

const connect = async (uri) => {
    try {
        await mongoose.open(uri), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
        signale.success(`Databse connect successfully !!!`)
    } catch (err) {
        signale.error(`Database connect failure !!!`)
    }
}

module.exports = { connect };
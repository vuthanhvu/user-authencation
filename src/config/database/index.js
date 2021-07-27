const mongoose = require('mongoose');
const signale = require('signale');

const connect = async (uri) => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        signale.success(`Databse connect successfully !!!`)
    } catch (err) {
        signale.error(`Database connect failure !!!`)
    }
}

module.exports = { connect };
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');

exports.signup = async (req, res, next) => {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    req.body.password = hashPassword;

    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        }
    })
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(500).json({
            status: 'failure',
            message: 'invalid email or password',
        })
    }

    const userFound = await User.findOne({ email: email });
    if (!userFound) {
        return res.status(500).json({
            message: 'Email not exits',
        });
    }

    const correctPassword = await bcrypt.compare(password, userFound.password);
    if (!correctPassword) {
        return res.status(400).json({
            message: 'Password is not correct !',
        })
    }
    const token = signToken(userFound._id);

    return res.status(200).json({
        status: 'success',
        token,
    })
}

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED });
}
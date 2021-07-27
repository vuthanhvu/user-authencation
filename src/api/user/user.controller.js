const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');

const User = require('./user.model');

const sendEmail = require('../../ultils/email');
const Email = require('../../ultils/emailClass');
const SendGridEmail = require('../../ultils/sendGridEmail');


// const multerStorage = multer.diskStorage({
//     destination: (req, file ,cb) => {
//         cb(null, 'src/public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Not image', false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})

exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = async (req, res, next) => {
    if (!req.file) next();

    req.file.filename = `user-${Date.now()}-500x500.jpeg`;
    console.log('===========', req.file);

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`src/public/img/users/${req.file.filename}`);
    console.log('===========1');
    next();
};

exports.uploadMultiPhotos = upload.fields([
    {name: 'imageCover', maxCount: 1},
    {name: 'images', maxCount: 3},
])

exports.resizeMultiPhotos = async (req, res, next) => {
    if(!req.files.imageCover || !req.files.images) return next();
    const fileNameImagesCover = `user-${Date.now()}-500x500.jpeg`;
    req.body.images = [];

    const newPromiseCoverImages =
        sharp(req.files.imageCover[0].buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`src/public/img/users/${fileNameImagesCover}`);

    const newPromiseImages = req.files.images.map((file, i) => {
        const fileNameImage = `user-${Date.now()}-500x500-${i + 1}.jpeg`;
        req.body.images.push(fileNameImage);
        return sharp(file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`src/public/img/users/${fileNameImage}`);
    });

    newPromiseImages.push(newPromiseCoverImages);
    await Promise.all(newPromiseImages);
    req.body.fileName = fileNameImagesCover;
    next();
}

exports.saveMultiPhotos = async (req, res, next) => {
    console.log('2==========>', req.body);
    return res.status(200).json({
        message: 'Love me to success!!!',
    })
}

exports.signup = async (req, res, next) => {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    req.body.password = hashPassword;

    const newUser = await User.create(req.body);

    // const mailOptions = {
    //     email: 'vuthanh20132950@gmail.com',
    //     subject: 'QuynhTran',
    //     message: 'Khi nao Quynh ve',
    // }
    // await sendEmail(mailOptions);
    // await new Email(newUser, '12345').sendWelcome();

    const mailOptions = {
        to: newUser.email,
        from: 'vuthanh20132950@gmail.com', // sender
        subject: 'Hello Quynh!!!',
        text: 'Khi nao Quynh ve!',
    }
    await new SendGridEmail().sendMail(mailOptions);

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
    const cookieOption = {
        httpOnly: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    }
    if (process.env.NODE_ENV == 'production') cookieOption.secure = true;

    res.cookie('jwt', token, cookieOption);

    return res.status(200).json({
        status: 'success',
        token,
    })
}

exports.updateMe = async (req, res, next) => {
    const userFound = await User.findOne({
        name: req.body.name
    });
    if (!userFound) {
        return res.status(404).json({
            message: 'User not exits'
        })
    }
    let filteredBody = {
        photo: 'Chanh.jpg',
        name: 'Chanh',
    };
    if (req.file) filteredBody.photo = req.file.filename;
    if (req.body.user) filteredBody.name = req.body.name;
    const updatedUser = await User.findByIdAndUpdate(userFound._id, filteredBody, {
        new: true,
        runValidator: true,
    });
    return res.status(200).json({
        status: 'success',
        data: updatedUser,
    })
}

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED });
}
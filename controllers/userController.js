const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.createUser = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
    .then(hash => {

        const user = new User({

            username: req.body.username,
            password: hash
        })

        user.save()
        .then(result => {

            res.status(201).json({meassage: 'User created', result})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({

                message: 'Invalid authentication credentials'
            })
        })
    })
} 

exports.userLogin = (req, res, next) => {

    let fetchedUser;
    User.findOne({username: req.body.username})
    .then(user => {

        if(!user){

            return res.status(401).json({
                message: 'Auth failed!'
            })

        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {

        if(!result){

            return res.status(401).json({
                message: 'Auth failed!'
            })
        }

        const token = jwt.sign(
            {
                username: fetchedUser.username, 
                userId: fetchedUser._id
             }, 'SECRET-THIS-SHOULD-BE-A-LONGER-STRING', 
             {expiresIn: '1h'}
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    })
    .catch(err => {

        return res.status(401).json({
            message: 'Invalid authentication credentials!'
        })
    })
}
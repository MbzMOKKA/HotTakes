//Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const User = require('../models/user');
const errorFunctions = require('../common/errors');
const successFunctions = require('../common/successes');

//Exports
exports.signUp = (request, response, next) => {
    //Hashing the password of the new user
    bcrypt.hash(request.body.password, 11)
        .then(hash => {
            //Hashed password created, creating the user
            const user = new User({
                email : request.body.email,
                password : hash,
            });
            //Saving the new user to the data base
            user.save()
                //User created
                .then(() => {
                    successFunctions.sendAccountCreationSuccess(response);
                })
                //Creation failed
                .catch(error => errorFunctions.sendServerError(response, error));
        })
        //Hashing failed
        .catch(error => errorFunctions.sendServerError(response, error));
};



exports.logIn = (request, response, next) => {
    //Looking if the user exists
    User.findOne({ email : request.body.email, })
        .then(user => {
            if(user===null){
                //User does not exists
                errorFunctions.sendLogInError(response);
            }else{
                //Email is okay
                bcrypt.compare(request.body.password, user.password)
                    .then(valid => {
                        if(!valid){
                            //Wrong password
                            errorFunctions.sendLogInError(response);
                        }else{
                            //Everything is okay, the user is logged in
                            response.status(200).json({
                                userId : user._id,
                                token : jwt.sign(
                                    { userId : user._id },
                                    process.env.TOKEN_SECRET_WORD,
                                    { expiresIn : '24h' },
                                ),
                            });
                        }
                    })
                    //Server error
                    .catch(error => errorFunctions.sendServerError(response, error));
            }
        })
        //Server error
        .catch(error => errorFunctions.sendServerError(response, error));
};
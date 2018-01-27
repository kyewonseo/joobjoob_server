'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.RegisterUser = (name, email, password) =>
    new Promise(((resolve, reject) => {
        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(password, salt);
        const newUser = new user({
            name: name,
            email: email,
            hashed_password: hashed_password,
            created_at: new Date()
        });
        newUser.save().then(() => resolve({
            status : 201,
            message : 'Sucessfully register user'
        })).catch(err =>{
            if(err.code == 11000){
                reject({ status: 409, message: 'User Already Registered !'});
            }else{
                reject({ status: 500, message: 'Internal Server Error !' });

            }
        });
    }));

'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.LoginUser = (email, password) =>
    new Promise((resolve, reject) => {
        user.find({email : email}).then(result => {
            if(result.length == 0){
                reject({status: 404, message: 'User Not Found !'});
            }else{
                return result[0];
            }
        }).then(user =>{
            if(bcrypt.compareSync(password, user.hashed_password)){
                resolve({ status: 200, message: email });
            }else{
                reject({ status: 401, message: 'Invalid Credentials !' });
            }
        }).catch(err =>
            reject({ status: 500, message: 'Internal Server Error !' })
        );
    });
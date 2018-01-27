'use strict';

const user = require('../models/user');

exports.GetProfile = email =>
    new Promise((resolve, reject) => {
       user.find({email : email}).then(results =>
           resolve(results[0])
       ).catch(err =>
           reject({ status: 500, message: 'Internal Server Error !' })
       )});
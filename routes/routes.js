const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('../functions/register');
const login = require('../functions/login');

const profile = require('../functions/profile');
const password = require('../functions/password');
const db = require('../util/db');

module.exports = router => {
    router.get('/', (req, res) => res.end('Welcome to Uniton Team 15!'));

    router.post('/authenticate', (req, res) => {
       const credentials = auth(req);
       if(credentials){
         login.LoginUser(credentials.name, credentials.pass)
           .then(result => {
             const token = jwt.sign(result, config.secret, { expiresIn: 1440 });
             res.status(result.status).json({message : result.message, token : token});

           })
           .catch(err => {
             res.status(err.status).json({message : err.message})
           });
       }else{
           res.status(400).json({ message: 'Invalid Request !' });
       }
    });

    router.post('/users', (req, res) => {
        const name = req.body.name;
        var email = req.body.email;
        const password = req.body.password;

        if(!name || !email || !password | !name.trim() || !email.trim() || !password.trim()){
            res.status(400).json({message: 'Invalid Request !'});
        }else{

          db.connectDB().then( register.RegisterUser(name, email, password)
                .then(result => {

                  console.log('name->'+name);
                  console.log('email->'+email);
                res.setHeader('Location', '/users'+email);
                res.status(result.status).json({message : result.message});
                })
                .catch(err => {
                    res.status(err.status).json({message : err.message});
                })
        );
        }
    });

    router.get('/users/:email', (req,res) => {
       if(checkToken(req)){
           profile.GetProfile(req.params.email)
               .then(result => {
                   res.json(result);
               })
               .catch(err => {
                   res.status(err.status).json({message : err.message});
               });
       }else{
           res.status(401).json({message : 'Invalid Token! '});
       }
    });

    router.put('users/:email', (req, res) => {
        if(checkToken(req)){
            const oldPassword = req.body.password;
            const newPassword = req.body.newPassword;

            if(!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()){
                res.status(400).json({message : 'Invalid Token! '});
            }else{
                password.ChangePassword(req.params.email, oldPassword, newPassword)
                    .then(result => {
                        res.status(result.status).json({message : result.message});
                    })
                    .catch(err => {
                        res.status(err.status).json({message : err.message});
                    });
            }
        }else{
            res.status(401).json({message : 'Invalid Token! '});
        }
    });

    router.post('/users/:email/password', (req,res) => {
        const email = req.params.email;
        const token = req.body.token;
        const newPassword = req.body.password;

        if(!token || !newPassword || !token.trim() || !newPassword.trim()){
            password.ResetPasswordInit(email)
                .then(result => res.status(result.status).json({ message: result.message }))
                .catch(err => res.status(err.status).json({ message: err.message }));
        }else{
            password.ResetPasswordFinish(email, token, newPassword)
                .then(result => res.status(result.status).json({ message: result.message }))
                .catch(err => res.status(err.status).json({ message: err.message }));
        }
    });


}



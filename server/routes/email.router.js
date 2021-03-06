let express = require('express');
let router = express.Router();
let passport = require('passport');
let path = require('path');
var pool = require('../modules/pool.js');
let nodemailer = require('nodemailer');
//let md5 = require('md5');
// let crypto = require('crypto');

// SENDS EMAIL TO DB 
router.post('/user', (req, res, next) => {
    let email = req.body;
    console.log('post req.body', email);
    // console.log('hash: ', md5(email.email));
    // let hash = md5(email.email);
    // create reusable transporter object using the default SMTP transport

    if (req.isAuthenticated()) {
        console.log('logged in email', req.user);
        // SEND EMAIL AND HASH TO DB
        pool.connect(function(errorConnectingToDatabase, client, done) {
            if (errorConnectingToDatabase) {
                //when connecting to database failed aka sadpath.
                console.log('Error connecting to database', errorConnectingToDatabase);
                res.sendStatus(500);
            } else {
                // when connecting to database worked aka HAPPYPATH!
                client.query('INSERT INTO crypto (email) VALUES ($1) RETURNING md5;', [email.email], function(errorMakingQuery, result) {
                    done(); //needed
                    if (errorMakingQuery) {
                        console.log('Error making database query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.DB_EMAIL_USERNAME,
                                pass: process.env.DB_EMAIL_PASSWORD
                            }
                        });

                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: '"Administrator"' + process.env.DB_EMAIL, // sender address  NEEDS ADDRESS
                            to: email.email, // list of receivers NEEDS ADDRESS
                            subject: 'New Administrator', // Subject line
                            text: 'Please click the following link: ' + process.env.DB_HOST + result.rows[0].md5
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);
                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        });
                        res.sendStatus(201);
                    }
                }); // end client.query
            }
        }); // end pool.connect

    } else {
        console.log('not logged in');
        res.sendStatus(403);
    }
});

// GET ROUTES FOR TRAINING 
router.post('/password', function(req, res, next) {
    var username = req.body;
    // console.log('username: ', username);
    if (req.isAuthenticated()) {
        // send back user object from database
        // console.log('logged in', req.user);
        pool.connect(function(errorConnectingToDatabase, client, done) {
            console.log('username: ', username.user_name)
            if (errorConnectingToDatabase) {
                //when connecting to database failed
                console.log('Error connecting to database', errorConnectingToDatabase);
                res.sendStatus(500);
            } else {
                // when connecting to database worked aka HAPPYPATH!
                client.query('INSERT INTO pword_reset (user_name) VALUES ($1) RETURNING md5;', [username.user_name], function(errorMakingQuery, result) {
                    done(); //needed
                    if (errorMakingQuery) {
                        console.log('Error making database query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.DB_USER,
                                pass: process.env.DB_PASS
                            }
                        });
                        // setup email data with unicode symbols
                        var mailOptions = {
                            from: '"Administrator"' + process.env.DB_EMAIL, // sender address  NEEDS ADDRESS
                            to: username.email, // list of receivers NEEDS ADDRESS
                            subject: 'New Administrator', // Subject line
                            text: 'Please click the following link to reset your password: ' + process.env.DB_RESET_PASSWORD + result.rows[0].md5
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);
                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        });
                        res.sendStatus(201);
                    }
                }); // end client.query
            }
        }); // end pool.connect
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        res.sendStatus(403);
    }
}); // end get

module.exports = router;
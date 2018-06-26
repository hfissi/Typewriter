/**
 * AuthController.js
 *
 * Unless you are trying to implement some custom functionality, you shouldn't
 * need to edit this file.
 */

 var modelLocation = '../models/admin'
 var playerLocation = '../models/player'

 /****************************************************************
 *				   DO NOT TOUCH BELOW THIS LINE 				 *
 ****************************************************************/

 var util = require('util');
 var express = require('express');
 var router = express.Router();
 var passport = require('passport');
 var config = require('../private/config');

 /**  Model and route setup **/

 var User = require(modelLocation).model;
 var Player = require(playerLocation).model;

 /****************************************************************
 *				   			Admin Local Strategy 		         *
 ****************************************************************/
var LocalStrategy = require('passport-local').Strategy;

    passport.use('admin_login', new LocalStrategy({
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        console.log(password);
        if (username)
            username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, console.log('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, console.log('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

     /****************************************************************
     *                          Player Local Strategy                *
     ****************************************************************/
    var LocalStrategy = require('passport-local').Strategy;

        passport.use('player_login', new LocalStrategy({
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, username, password, done) {
            console.log(password);
            if (username)
                username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                Player.findOne({ 'username' :  username }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, console.log('loginMessage', 'No user found.'));

                    if (!user.validPassword(password))
                        return done(null, false, console.log('loginMessage', 'Oops! Wrong password.'));

                    // all is well, return user
                    else
                        return done(null, user);
                });
            });

        }));

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      var key;
      if(user instanceof User) {
            key = {
                id: user.id,
                type: 1
            }
        } else if (user instanceof Player) {
            key = {
                id: user.id,
                type: 2
            }
        }
      done(null, key);
    });

    // used to deserialize the user
    passport.deserializeUser(function(key, done) {
          if(key.type === 1){
              User.findById(key.id, function(err, user) {
                  done(err, user);
              });
          } else if (key.type === 2){
              Player.findById(key.id, function(err, user) {
                  done(err, user);
              });
          }
      });

    // route middleware to ensure user is logged in
    module.exports.isAuthenticated = function(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/login');
    }

/****************************************************************
 *                          Admin login                       *
 ****************************************************************/

router.post('/login', passport.authenticate('admin_login', {
    successRedirect : '/admin', // redirect to the secure profile section
    failureRedirect : '/login'
}));

/****************************************************************
 *                          Player login                       *
 ****************************************************************/

router.post('/player/login', 
  passport.authenticate('player_login', { failureRedirect: '/' }),
  function(req, res) {
      res.status(200).json({
        status: 'hello'
      });
  });

module.exports.router = router;

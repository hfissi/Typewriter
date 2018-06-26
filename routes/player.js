  /**
   * player.js
   *
   * Unless you are trying to implement some custom functionality, you shouldn't
   * need to edit this file.
   */

  var modelLocation = '../models/player';
  var scoreLocation = '../models/score';
  var util = require('util');
  var express = require('express');
  var passport = require('passport');
  var config = require('../private/config');
 
  /**  Model and route setup **/
  var User = require(modelLocation).model;
  var Score = require(scoreLocation).model;
  const route = require(modelLocation).route;
  const routeIdentifier = util.format('/%s', route);

 /** Router setup **/
  var router = express.Router();

/*
 * GET current user
 *
 */
router.post('/player/register', function(req, res) {
    if (req.body === undefined || req.body.username === undefined || req.body.email === undefined || req.body.password === undefined) {
        return res.json({
            status: 'Failure',
            message: 'Both username and password must be defined in the query string!'
        });
    }

    if (req.body.username === "") {
        return res.json({
            status: 'Failure',
            message: 'Username cannot be empty!'
        });
    }

    if (req.body.email === "") {
        return res.json({
            status: 'Failure',
            message: 'Username cannot be empty!'
        });
    }

    if (req.body.password === "") {
        return res.json({
            status: 'Failure',
            message: 'Password cannot be empty!'
        });
    }

  User.create(req.body, function (err, entry) {
    if (err) return res.send(err);

        return res.redirect('/');
  });
});
/*
 * Logout
 *
 */
router.get('/player/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});
/*
 * GET current user
 *
 */
router.get('/player/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});
/*
 * GET current user
 *
 */
router.post('/player/score',function (req, res) {
  let Sc = {};
  console.log(req.body.user)
  let query = {user : req.body.user};
  Sc.score = req.body.score;
  Sc.user = req.body.user;
  console.log(Sc)
  Score.findOneOrCreate(query, Sc, function(err, score) {
    if (err) {
      console.log(err);
    }else{
      Score.update(query,Sc,function(err){
        if (err) {
          console.log(err);
        }
      });
    }
  });
});
/*
 * GET current user id
 *
 */
router.get('/CurrentUserId', function(req, res) {
  res.status(200).json({
    status: true,
    id : req.user._id
  });
});
/*
 * GET current user
 *
 */
router.get('/CurrentUser', function(req, res) {
  res.status(200).json({
    status: true,
    user : {'id': req.user._id, 'username' : req.user.username}
  });
});

module.exports = router;
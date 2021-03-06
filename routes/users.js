/**
 * user.js
 *
 * Unless you are trying to implement some custom functionality, you shouldn't
 * need to edit this file.
 */

 var modelLocation = '../models/admin'

 /****************************************************************
 *				   DO NOT TOUCH BELOW THIS LINE 				 *
 ****************************************************************/

 var util = require('util');
 var express = require('express');

 /**  Model and route setup **/

 var model = require(modelLocation).model;
 const route = require(modelLocation).route;
 const routeIdentifier = util.format('/%s', route);

 /** Router setup **/

 var router = express.Router();

 /** Express routing **/
/*
 * Post /create
 *
 */

 router.post('/create', function(req, res, next) {
   console.log(req.body);
    if (req.body === undefined || req.body.username === undefined || req.body.password === undefined) {
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

    if (req.body.password === "") {
        return res.json({
            status: 'Failure',
            message: 'Password cannot be empty!'
        });
    }

 	model.create(req.body, function (err, entry) {
 		if (err) return res.send(err);

        return res.json({
            status: 'Success',
            message: 'User was created!'
        });
 	});
 });


 module.exports = router;

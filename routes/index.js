/**
 * user.js
 *
 * Unless you are trying to implement some custom functionality, you shouldn't
 * need to edit this file.
 */

 /**  Model and route setup **/
 var util = require('util');
 var express = require('express');
 const routeIdentifier = util.format('/%s', 'routing');
 
 /** Router setup **/
 var router = express.Router();
 
 /** Express routing **/
 /* GET home page. */
 router.get('/', function(req, res) {
  res.render('app/index');
 });

 router.get(routeIdentifier+'/intro', function(req, res) {
  res.render('app/routing/intro');
 });
 router.get(routeIdentifier+'/login', function(req, res) {
  res.render('app/routing/login');
 });
 router.get(routeIdentifier+'/signup', function(req, res) {
  res.render('app/routing/signup');
 });
 router.get(routeIdentifier+'/play', function(req, res) {
  res.render('app/routing/game');
 });

 module.exports = router;

/**
 * Default REST contoller for your db.
 *
 * Usage:
 *	(1) Change the modelLocation variable to the location where your corresponding model
 *		is stored.
 *
 *	(2 - optional) Add custom routing for your API. NOTE: If you don't know what this means,
 *				   you don't need it.
 */

var modelLocation = '../models/para';
var modelScore = '../models/score';
var playerScore = '../models/player';

 /****************************************************************
 *				   DO NOT TOUCH BELOW THIS LINE 				 *
 ****************************************************************/

var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');

/**  Model and route setup **/

var model = require(modelLocation).model;
var userModel = require('../models/admin').model;
var scoreModel = require(modelScore).model;

const route = require(modelLocation).route;
const routeIdentifier = util.format('/%s', route);

/** Express setup **/

var router = express.Router();

/** Express routing **/

/*
 * GET page admin.
 *
 */

router.get(routeIdentifier, function(req, res, next) {
    model.find({}, function (err, items) {
        if (err) return res.send(err);
        return res.render('admin/index',{items:items});
    });
});

/*
 * GET page insertion
 *
 */

router.get(routeIdentifier+'/insertion', function(req, res, next) {
  res.render('admin/add');
});

/*
 * GET page login
 *
 */
router.get('/login', function(req, res, next) {
  res.render('admin/login');
});
/*
 * GET page Logout
 *
 */
router.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});

/*
 * GET page signup
 *
 */
router.get('/signup', function(req, res, next) {
  res.render('admin/signup');
});

/*
 * POST Data
 *
 */
router.post(routeIdentifier+'/add',function (req, res, next) {
    if ((req.body.title).length !== 0 && (req.body.title).length !== 0) {
         var newPara = new model({
           title : req.body.title,
           size : req.body.size,
           para : req.body.para,
           paraLength : req.body.para.split(' ').length
        });
        newPara.save(function(err) {
        if (err) {
          console.log(err);
          return;
        }else {
          res.redirect(routeIdentifier);
        }
        });
    }else{
        console.log('fields can not be empty');
    }
})
/*
 * Display on item
 *
 */
router.get(routeIdentifier+'/list/:id',function(req,res){
    let query = {_id:req.params.id};
    model.findById(req.params.id,function(err,item){
        if (!err) {
            res.render('admin/paragaph',{
              item:item
            });
        }else {
            res.send('vide');
        }
    });
});;/*
 * Display all data
 *
 */
 router.get('/list', function(req, res, next) {
  model.find({}, function (err, objects) {
    if (err) return res.send(err);
    return res.json(objects);
  });
 });
/*
 * Get score
 *
*/
router.get(routeIdentifier+'/score',function(req,res){
    scoreModel.find({}, function (err, score){
      if (!err) {
          res.render('admin/player',{
            score : score
          });
      }else {
          res.send('vide');
      }
    });
});
/*
 * Get Score 
 *
 **/
router.get('/score',function(req,res){
    scoreModel.find({}, function (err, score){
      if (!err) {
          return res.json(score);
      }
    });
});
/*
 * Display all data
 *
 */
 router.get('/list', function(req, res) {
  model.find({}, function (err, objects) {
    if (err) return res.send(err);
    return res.json(objects);
  });
 });
/*
 * Edit item
 *
*/
router.get(routeIdentifier+'/edit/:id',function(req,res){
    let query = {_id:req.params.id};
    model.findById(req.params.id,function(err,item){
        if (!err) {
            res.render('admin/edit',{
              item:item
            });
        }else {
            res.send('vide');
        }
    });
});
/*
 * Post upadte item
 *
*/
router.post(routeIdentifier+'/update/:id',function(req,res) {
   model.findById(req.params.id,function(err,item){
      if (!err){
          let Para = {};
          let query = {_id:req.params.id};
          Para.title = req.body.title;
          Para.size = req.body.size;
          Para.para = req.body.para;
          Para.paraLength = req.body.para.split(' ').length;
          model.update(query,Para,function(err){
          if (err) {
            console.log(err);
          }else {
            res.redirect(routeIdentifier+'/edit/'+req.params.id);
          }
        });
      }
  });
})
/*
 * Delete item
 *
*/
router.get(routeIdentifier+'/del/:id',function(req,res){
    let query = {_id:req.params.id};

    model.remove(query,function(err){
            if (err) {
                console.log(err)
            }
            res.redirect(routeIdentifier);
    });
});

module.exports = router;
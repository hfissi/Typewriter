/**
 * Default skeleton for a model in your db.
 *
 * Usage:
 *	(1) Change the route to what route you would like to access this model at.
 *		For instance, if the route is 'recipe', then your API should be accessible
 * 		at http://localhost:3000/api/recipe.
 *
 *  (2) Change the modelId to the name of your file without the extension (.js).
 *		This name is generally capitalized.
 *
 *	(3) Edit the mongoose schema (instructions on doing so: http://mongoosejs.com/docs/guide.html)
 */

var mongoose = require('mongoose');

const route = 'admin'; 	// Route: 'recipe' routes to /recipe
const modelId = 'para';  	// Same name as file, no extension: Para'

var Schema = new mongoose.Schema({

	/** Make your edits here **/

	title: {type: String, required: true},
	size: {type: String, required: true},
	para: {type: String, required: true},
	paraLength: {type: String, required: true},
	updated_at: { type: Date, default: Date.now, required: true }
});

 /****************************************************************
 *				   DO NOT TOUCH BELOW THIS LINE 				 *
 ****************************************************************/

module.exports = {
	model: mongoose.model(modelId, Schema),
	route: route
}

/*var express = require("express");
var app = express();*/

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

/*var mongoose = require('mongoose');
const url = require('url');

const MongoClient = require("mongodb").MongoClient;
const uri = 'mongodb+srv://vishaka:Vishaka@cluster0.u0mor.mongodb.net/questions?retryWrites=true&w=majority';*/


/*var tutorSchema = new mongoose.Schema({
	subject: String,
	rate: Number,
	exam: String,
	level: String
});

var Tutor = mongoose.model('Tutor', tutorSchema);*/

//function to retrieve relevant tutors
/*function searchTutor(req, res, client){
	console.log('in function now');

	var sub = req.query.subject;
	var rate = req.query.rate;
	var exam = req.query.exam;
	var level = req.query.level;

	client.connect(err => {
		collection = client.db("tutor").collection("currentTutor");
		console.log("success");

		collection.find({ $query: {subject:sub, rate: {"$gte" : rate, "$lte" : rate + 200}, exam : exam, level: level}, $orderby : {rate: 1}}).toArray(function(err, data){
			if(err) throw err;
			console.log(data);

			res.render('./tutorsearch.ejs', {tutorData: data});


		});


	});


}*/


	//making express app available here
module.exports = function(app){
	app.get('/student', function(req,res){

		//var client = new MongoClient(uri, { useNewUrlParser: true});
		console.log(req.query);

		//searchTutor(req, res, client);

		res.render('./student.ejs');

	});

};




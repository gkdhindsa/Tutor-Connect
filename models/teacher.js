var mongoose =require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose");

var TeacherSchema =  new mongoose.Schema({
	name:String,
	email:String,
	DateOfBirth:Date,
	CurrTeaching:String,
	username:String,
	password:String,
	DP: 
    { 
        data: Buffer, 
        contentType: String 
    } 
	
	
	
});

TeacherSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("teacher",TeacherSchema)
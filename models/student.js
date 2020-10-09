var mongoose =require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose");

var StudentSchema =  new mongoose.Schema({
	name:String,
	email:String,
	DateOfBirth:Date,
	CurrEducation:String,
	username:String,
	password:String,
	DP: 
    { 
        data: Buffer, 
        contentType: String 
    } 
	
	
	
});

StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("student",StudentSchema)
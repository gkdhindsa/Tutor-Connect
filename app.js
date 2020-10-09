var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var LocalMongoose = require('passport-local-mongoose');
var flash = require('connect-flash');
var student = require('./models/student.js');
var teacher = require('./models/teacher.js');
var authstudent = new passport.Passport();
	fs   = require('fs'),
	path = require('path');
    require('dotenv/config');
var multer = require('multer'); 
var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 

var upload = multer({ storage: storage }); 
mongoose.connect('mongodb+srv://abhishek:abhishek54321@cluster0.dfvfh.mongodb.net/<dbname>?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static((__dirname+"/public")));
app.set("view engine","ejs");
app.use(flash());

app.use(require("express-session")({
	secret:"KEY123",
	resave:false,
	saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(authstudent.initialize())
app.use(authstudent.session())
authstudent.use(new LocalStrategy(student.authenticate()));
passport.use(new LocalStrategy(teacher.authenticate()));
authstudent.serializeUser(student.serializeUser());
authstudent.deserializeUser(student.deserializeUser());
passport.serializeUser(teacher.serializeUser());
passport.deserializeUser(teacher.deserializeUser());
app.use(function(req,res,next){
	res.locals.CurrentUser = req.user;
	next();
})	


app.get('/',function(req,res){
	res.render("landing");
})
//DEFINE THE AUTH ROUTES HERE
app.get('/student/register',function(req,res){
	res.render("auth/StudentRegister");
})

app.post('/student/register',upload.single('DP'),function(req,res,next){
	var newstudent = new student({
	name:req.body.name,
	email:req.body.email,
	DateOfBirth:req.body.DATE,
	CurrEducation:req.body.EDUCATION,
	username:req.body.username,
		DP: { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        	} 
	});
	student.register(newstudent,req.body.password,function(err,stud){
		if(err){
			console.log("Not registered");

		}
		else{
			authstudent.authenticate("local")(req,res,function(){
				res.render('homepage');
		})
		}
	})
	
	
})


app.get('/student/login',function(req,res){
	res.render("auth/StudentLogin");
})

app.post('/student/login',authstudent.authenticate("local",{
	successRedirect:"/home",
	failureRedirect:"/student/login"

}),function(req,res){
	
})

app.get('/teacher/register',function(req,res){
	res.render("auth/TeacherRegister");
})

app.post('/teacher/register',upload.single('DP'),function(req,res,next){
	var newteacher = new teacher({
	name:req.body.name,
	email:req.body.email,
	DateOfBirth:req.body.DATE,
	CurrTeaching:req.body.EDUCATION,
	username:req.body.username,
		DP: { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        	} 
	});
	teacher.register(newteacher,req.body.password,function(err,tchr){
		if(err){
			console.log("Not registered");

		}
		else{
			passport.authenticate("local")(req,res,function(){
				res.render('homepage');
		})
		}
	})
	
	
})


app.get('/teacher/login',function(req,res){
	res.render("auth/TeacherLogin");
})

app.post('/teacher/login',passport.authenticate("local",{
	successRedirect:"/home",
	failureRedirect:"/teacher/login"

}),function(req,res){
	
})

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
})

app.get('/home',function(req,res){
	res.render("homepage");
})
		
app.listen(process.env.PORT || 3000,function(){
	console.log("server started turotpick");
})
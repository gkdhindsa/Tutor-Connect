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
var authteacher = new passport.Passport();
//var authstudent = require('passport');
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

function isstudent(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/login');
	}
}

function isteacher(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/login');
	}
}



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

app.use(authteacher.initialize({ userProperty:'teacheruser'}));
app.use(authteacher.session());
//app.use(authstudent.initialize({ userProperty:'studentuser'}));
app.use(authstudent.initialize({ userProperty:'studentuser'}));
//app.use(passport.initialize({ userProperty: 'roomUser' }));
app.use(authstudent.session())
authteacher.use(new LocalStrategy(teacher.authenticate()));
authstudent.use(new LocalStrategy(student.authenticate()));
authteacher.serializeUser(teacher.serializeUser());
authteacher.deserializeUser(teacher.deserializeUser());
authstudent.serializeUser(student.serializeUser());
authstudent.deserializeUser(student.deserializeUser());

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
	successRedirect:"/student/home",
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
			authteacher.authenticate("local")(req,res,function(){
				res.render('homepageTutor');
		})
		}
	})
	
	
})


app.get('/teacher/login',function(req,res){
	res.render("auth/TeacherLogin");
	
})

app.post('/teacher/login',authteacher.authenticate("local",{
	successRedirect:"/teacher/home",
	failureRedirect:"/teacher/login"

}),function(req,res){
	
})

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
})

app.get('/student/home',function(req,res){
	res.render("homepage");
	console.log(req.studentuser);
})

app.get('/teacher/home',function(req,res){
	res.render("homepageTutor");
	console.log(req.teacheruser._id);
})
		

//template engine
//app.set('view engine', 'ejs');

//static files
//app.use(express.static('./Tutor-Connect'));


var stud = require('./models/studentController');
stud(app);
/*var student = require('./models/studentController.js');
app.use('/students', student);*/

//Suggested Teacher Route

app.get('/tutormatch/all',function(req,res){
	teacher.find({},function(err,foundteachers){
		if(err){
			console.log(err);
		}
		else{
			res.render("tutormatch",{teacher:foundteachers});
		}
	})
	
})

app.get('/tutor/:tutorid',function(req,res){
	teacher.find({_id:req.params.tutorid},function(err,foundteacher){
		if(err){
			console.log(err);
		}
		else{
			res.render("TutorPersonal",{teacher:foundteacher[0]});
		}
	})
})


app.listen(process.env.PORT || 3000,function(){
	console.log("server started turotpick");
})
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


var username;
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
	username = req.teacheruser;
	console.log(req.teacheruser);
})
		

//template engine
//app.set('view engine', 'ejs');

//static files
//app.use(express.static('./Tutor-Connect'));


/*var stud = require('./models/studentController');
stud(app);*/
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





const MongoClient = require("mongodb").MongoClient;
var urlencodedParser = bodyParser.urlencoded({extended: false});
const uri = 'mongodb+srv://abhishek:abhishek54321@cluster0.dfvfh.mongodb.net/<dbname>?retryWrites=true&w=majority';

//mongoose.connect(uri);

var tutorSchema = new mongoose.Schema({
	username: String,
	subject: String,
	rate: Number,
	exam: String,
	days: [String],
	gender: String,
	age: Number,
	level: String,
});

var Tutor = mongoose.model('Tutor', tutorSchema);

//function to retrieve relevant tutors
function searchTutor(req, res){
	console.log('in function now');
	var client = new MongoClient(uri, { useNewUrlParser: true});
	var sub = req.query.subject;
	var minrate = req.query.minrate;
	var maxrate = req.query.maxrate;
	var exam = req.query.exam;
	var dayData1 = [];
	if("mon" in req.query)
			dayData1.push("mon");
		if("tue" in req.query)
			dayData1.push("tue");
		if("wed" in req.query)
			dayData1.push("wed");
		if("thu" in req.query)
			dayData1.push("thu");
		if("fri" in req.query)
			dayData1.push("fri");
		if("sat" in req.query)
			dayData1.push("sat");
		if("sun" in req.query)
			dayData1.push("sun");
		console.log(dayData1);

	var level = req.query.level;
	var gender = req.query.gender;
	var minage = req.query.minage;
	var maxage = req.query.maxage;

	client.connect(err => {
		collection = client.db("<dbname>").collection("currentTutor");
		console.log("success");

		collection.find({subject: sub}).toArray(
							function(err, data){
			if(err) throw err;
			console.log(data);
			
			//res.render('./tutorsearch.ejs', {tutorData: data});


		});
		//res.send("yo");

	});


}





app.get('/student', function(req,res){

		//var client = new MongoClient(uri, { useNewUrlParser: true});
		console.log(req.query);

		//searchTutor(req, res, client);
		
		searchTutor(req,res);

		res.render('./student.ejs');

	});

	app.get('/update', function(req,res){
		res.render('./tutorUpdate.ejs');
	});

	app.post('/update', urlencodedParser,  function(req, res){
		console.log(req.body);
		var data = req.body;
		var dayData = [];
		if("mon" in data)
			dayData.push("mon");
		if("tue" in data)
			dayData.push("tue");
		if("wed" in data)
			dayData.push("wed");
		if("thu" in data)
			dayData.push("thu");
		if("fri" in data)
			dayData.push("fri");
		if("sat" in data)
			dayData.push("sat");
		if("sun" in data)
			dayData.push("sun");
		console.log(dayData);
		//console.log(res.locals.CurrentUser);
		var updateData = new Tutor({
			username: data.username,
			subject: data.subject,
			rate: data.rate,
			exam: data.exam,
			days: dayData,
			gender: data.gender,
			age: data.age,
			level: data.level


		});
		var collection;

		var client = new MongoClient(uri, { useNewUrlParser: true});
		client.connect(err => {

			  collection = client.db("<dbname>").collection("currentTutor");
			  
			  console.log("success");

			  	collection.insertOne(updateData, (err, result) => {
				        if(err) {
				            return res.status(500).send(err);
				            console.log(err);
				        }

				 
				        	console.log("done");
				
	        });
			  	client.close();
		});

	

		res.render('./homepageTutor.ejs');

	});




app.listen(process.env.PORT || 3000,function(){
	console.log("server started turotpick");
})
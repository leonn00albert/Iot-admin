const express = require('express');
var dotenv = require('dotenv').config();
var passport =require('passport');
const  bodyParser = require('body-parser');
var User = require("./models/users");
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var passportLocalMongoose = require('passport-local-mongoose');
var mongoose =require('mongoose');
const axios = require('axios')


const app = express();

mongoose.connect('mongodb://localhost/iot_db', {useNewUrlParser: true,  useUnifiedTopology : true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")


app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
// passport setup

app.use(require("express-session")({
	secret: "frank the cat is awesome",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

var token = ""
var currentUser = ""
var foundDevices = ""
app.use(function(req, res , next){
	res.locals.currentUser = req.user;
	next();
})


app.get("/login", function(req,res){
    res.render("sign-in")
})

app.get("/devices/new", function(req,res){
    res.render("devices/new-device")
})

app.get("/devices", function(req,res){
	
	axios.get('http://localhost:9000/api/v1/devices?access_token=' +token)
	  .then((rep) => {
		foundDevices= rep.data;
		
		res.render("devices/index",{devices: foundDevices})
	  })
	  .catch((error) => {
		console.error(error)
	  })

	  
})

app.get("/register", function(req,res){
    res.render("sign-up")
})

app.get("/show", function(req,res){
	console.log(token)
	console.log(currentUser)
})

app.post("/login", function(req,res){
	axios.post('http://localhost:9000/auth/local', {
		email: req.body.email,
		password: req.body.password
	  })
	  .then((rep) => {
		

		token = rep.data.token;
		currentUser = rep.data.user;

		console.log(token)
		
	  })
	  .catch((error) => {
		console.error(error)
	  })
	  
	  res.redirect("/devices")
})

app.post("/devices/new", function(req,res){

	console.log(req.body.name)
	axios.post('http://localhost:9000/api/v1/devices?name=' + req.body.name + '&macAddress=' + req.body.macAddress + '&access_token=' +token,
	{
		macAddress: req.body.macAddress,
		name: req.body.name
		
	  })
	  .then((rep) => {
		
		console.log(token)
		
	  })
	  .catch((error) => {
		console.error(error)
	  })
	  
	  res.redirect("back")
})


app.post("/register", function(req,res){
	axios.post('http://localhost:9000/api/v1/users', {
		email: req.body.email,
		password: req.body.password,
		name: req.body.name
		
	  })
	  .then((rep) => {
		

		token = rep.data.token;
		currentUser = rep.data.user;

		console.log(token)
		
	  })
	  .catch((error) => {
		console.error(error)
	  })
	  
	  res.redirect("back")
})



app.listen(3000, function(){
	console.log("The IoT server has started");
});
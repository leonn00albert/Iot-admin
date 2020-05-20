const express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var passport =require('passport');
const  bodyParser = require('body-parser');

var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var passportLocalMongoose = require('passport-local-mongoose');
var mongoose =require('mongoose');
const axios = require('axios')


router.get("/devices/new", function(req,res){
    res.render("devices/new-device")
})
router.get("/devices", function(req,res){
    res.render("devices/index")
})


router.post("/devices/new", function(req,res){
    var token = req.app.get('token');
  
	axios.post('http://localhost:9000/api/v1/devices?name=' + req.body.name + '&macAddress=' + req.body.macAddress + '&access_token=' +token)
	  .then((res) => {
		
		console.log(token)
		
	  })
	  .catch((error) => {
		console.error(error)
	  })
	  
	  res.redirect("back")
})

module.exports = router;
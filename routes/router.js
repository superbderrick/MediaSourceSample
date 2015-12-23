var express = require("express");
var route = express.Router();

//main page router
route.get('/' , function (req , res) {
	res.render('index');
});

route.get('/shaka' , function (req , res) {
	res.render('shaka');
});

route.get('/video' , function (req , res) {
	res.render('video');
});

route.get('/setting' , function (req , res) {
	res.render('setting');
});

route.get('/ms' , function (req , res) {
	res.render('ms');
});



module.exports = route;

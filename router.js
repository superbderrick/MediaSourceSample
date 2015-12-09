var express = require("express");
var app = express();
app.get('/shaka' , function (req , res) {
	console.log('called from ui');
	res.render('shaka');
});

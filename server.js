var express = require("express");
var app = express();
var router = express.Router();
var path = require('path');

//var mymodule = require('./router.js');

app.set("view engine" , 'ejs');
app.use(express.static(path.join(__dirname , 'public')));

app.get('/' , function (req , res) {
	res.render('index');
});

app.get('/shaka' , function (req , res) {
	res.render('shaka');
});


// app.get('/shaka' , function (req , res) {
// 	res.render('shaka');
// });


app.listen(8080,function(){
  console.log("Start at Server 8080");
});
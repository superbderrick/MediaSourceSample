var express = require("express");
var app = express();
var router = express.Router();
var path = require('path');

app.set("view engine" , 'ejs');
app.use(express.static(path.join(__dirname , 'public')));

app.get('/' , function (req , res) {
	res.render('index');
});

app.listen(8080,function(){
  console.log("Start at Server 8080");
});
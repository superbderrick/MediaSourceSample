var express = require("express");
var app = express();
var path = require('path');
var route = require("./routes/router.js");

app.set("view engine" , 'ejs');
app.set("views", "./views");

app.use(express.static(path.join(__dirname , 'public')));
app.use("/", route);

app.listen(3000,function(){
  console.log("Start at Server 3000");
});

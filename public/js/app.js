var app = function() {};

app.testURL = null;

app.uri = null;



app.onContentChange = function () 
{

  var mpd = document.getElementById('contentsList').value;
  app.testType = mpd ;
  
}

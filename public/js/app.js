var app = function() {};

app.testType = 'assets/frag_bunny.mp4';

app.video = null;



app.onContentChange = function () 
{
  var mpd = document.getElementById('contentsList').value;
  app.testType = mpd ;
}

app.loadStream = function ()
{
	console.log('check support mediaSource possibility');
    if(app.checkSupportSource)
    {
      video = document.querySelector('video');	
      console.log(video);	
      var player = new Player(app.testType , video);
	  player.init();
    } else
      console.error('Unsupported MIME type or codec: ', mimeCodec);
}

app.checkSupportSource = function ()
{
  var issupport = false;
  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    issupport = true;
  } else
    issupport = false;
}


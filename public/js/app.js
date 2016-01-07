var app = function() {};


app.url = 'assets/frag_bunny.mp4';
app.demoType = 0 ;
app.video = null;


app.onContentChange = function () 
{
  var demoUrl = document.getElementById('contentsList').value;
  var demoIndex = document.getElementById('contentsList').selectedIndex;

  app.url = demoUrl ;
  app.demoType = demoIndex ;
}

app.loadStream = function ()
{
	console.log('check support mediaSource possibility');

    if(app.checkSupportSource)
    {
      video = document.querySelector('video');	
      
      var loader = new Loader(app.demoType , app.url, video );
      loader.load();

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


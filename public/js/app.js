var app = function(){};

app.url = 'assets/frag_bunny.mp4';
app.demoType = null;
app.video = null;

app.onContentChange = function() {
  var demoUrl = document.getElementById('contentsList').value;
  var demoIndex = document.getElementById('contentsList').selectedIndex;

  app.url = demoUrl ;
  app.demoIndex = demoIndex ;
}

app.loadStream = function() {
  if(app.checkSupportSource) {
    video = document.querySelector('video');	

    var loader = new Loader(app.changedDemotypToString(app.demoIndex), app.url, video);
    loader.load();

  } else
    console.error('Unsupported MIME type or codec: ', mimeCodec);
}

app.checkSupportSource = function() {
  var issupport = false;
  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    issupport = true;
  } else
    issupport = false;
}

app.changedDemotypToString = function(index) {
  var demoType;
  switch (index) {
  case 0 : demoType = 'VIDEOTAG';
               break;
  case 1 : demoType = 'MEDIASOURCE';
               break;
  case 2 : demoType = 'MEDIASOURCE_SEGMENT';
               break;             
  case 3 : demoType = 'MEDIASOURCE_DASH_SEGMENTLIST';
               break;
  case 4 : demoType = 'MEDIASOURCE_DASH_SEGMENTLIST';
               break;
  default: demoType = 'VIDEOTAG';
               break;               
  }

  return demoType;
}

app.refersh = function() {
  location.reload(true);
}


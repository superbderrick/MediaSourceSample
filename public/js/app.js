var app = {};

var assetURL = 'assets/frag_bunny.mp4';

var mediaSource = null;
var mimeCodec = null;
var video = null;
var sourceBuffer = null;

//segments for information.
var segmentLength = 0;
var segmentDuration = 0;
var bytesFetched = 0;
var requestedSegments = [];
var totalSegments = 5;

app.loadStream = function()
{
   this.play();
};

app.play = function ()
{
   app.typeB();
};

app.init = function ()
{
  // setup video and source and assign media codec.
  video = document.querySelector('video');
  mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  mediaSource = new MediaSource;

  // initialize requestedSegemnts.
  for (var i = 0; i < totalSegments; ++i)
  {
    requestedSegments[i] = false;
  }

  // set url and register souropen event.
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', app.sourceOpen);
}

app.sourceOpen = function ()
{
  console.log('sourceOpen is called ');
  //setup sourceBuffer.
   sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

  //Get FileLength 
   app.getFileLength(assetURL , app.setsegments)
}

app.getFileLength = function(url, cb)  {
    var xhr = new XMLHttpRequest;
    xhr.open('head', url);
    xhr.onload = function () {
      console.log(xhr.getResponseHeader('content-length'));
      cb(xhr.getResponseHeader('content-length'));
      };
    xhr.send();
  };

app.setsegments = function(fileLength)
{
    console.log('filesize : ' + fileLength);
    console.log((fileLength / 1024 / 1024).toFixed(2), 'MB');

    segmentLength = Math.round(fileLength / totalSegments);
    console.log('segmentLength : ' + segmentLength);

    app.fetchRange(assetURL, 0, segmentLength, app.appendSegment);

    requestedSegments[0] = true;

    app.registerVideoEvent();
}

app.registerVideoEvent = function ()
{
    video.addEventListener('timeupdate', app.checkBuffer);  
    video.addEventListener('canplay', app.canPlayEvent);  
    video.addEventListener('seeking', app.seek);  
}

app.seek = function (event)
{
  console.log(event);
  if (mediaSource.readyState === 'open') {
    sourceBuffer.abort();
    console.log(mediaSource.readyState);
  } else {
    console.log('seek but not open?');
    console.log(mediaSource.readyState);
  }
}

   
app.canPlayEvent = function ()
{
   segmentDuration = video.duration / totalSegments;
   video.play();
}

app.fetchRange =  function  (url, start, end, cb) 
{
    var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';

    xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);

    xhr.onload = function () {
      bytesFetched += end - start + 1;
      console.log(bytesFetched);
      cb(xhr.response);
    };
    xhr.send();
};

  app.checkBuffer = function  () {
    console.log('checkBuffer called ');

    var currentSegment = app.getCurrentSegment();
    console.log(currentSegment);

    if (currentSegment === totalSegments && app.haveAllSegments()) {
      console.log('last segment', mediaSource.readyState);
      mediaSource.endOfStream();
      video.removeEventListener('timeupdate', app.checkBuffer);
    } 
    else if (app.shouldFetchNextSegment(currentSegment)) {
      requestedSegments[currentSegment] = true;
      console.log('time to fetch next chunk', video.currentTime);
      app.fetchRange(assetURL, bytesFetched, bytesFetched + segmentLength, app.appendSegment);
    }
    
  };

  app.getCurrentSegment = function()
   {
        return ((video.currentTime / segmentDuration) | 0) + 1;
   };
  app.haveAllSegments = function ()
  {
      return requestedSegments.every(function (val)
       { return !!val; });
   };


  app.shouldFetchNextSegment = function(currentSegment) {
    return video.currentTime > segmentDuration * currentSegment * 0.8 &&
      !requestedSegments[currentSegment];
  };



app.checkSupportSource = function ()
{
  var issupport = false;
  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    issupport = true;
  } else
    issupport = false;
} 

 app.appendSegment = function (chunk) {
        console.log(chunk);
        sourceBuffer.appendBuffer(chunk);
      };


app.typeB = function ()
{
    if(app.checkSupportSource)
    {
      app.init(); 
    } else
      console.error('Unsupported MIME type or codec: ', mimeCodec);
}



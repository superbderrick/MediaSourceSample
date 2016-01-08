var segmentPlayer = {};

segmentPlayer.url = null;

segmentPlayer.mediaSource = null;
segmentPlayer.sourceBuffer = null;
segmentPlayer.mimeCodec = null;
segmentPlayer.video = null;

segmentPlayer.segmentLength = 0;
segmentPlayer.segmentDuration = 0;
segmentPlayer.bytesFetched = 0;
segmentPlayer.requestedSegments = [];
segmentPlayer.totalSegments = 5;


segmentPlayer.init = function (url , video) {
	segmentPlayer.url = url;
  segmentPlayer.video = video;
}

segmentPlayer.play = function () {
	segmentPlayer.createModule();
  segmentPlayer.initializeSegments();
  segmentPlayer.setVideo();
}

segmentPlayer.createModule = function () {
	segmentPlayer.mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
 	segmentPlayer.mediaSource = new MediaSource;
}
segmentPlayer.initializeSegments = function () {
  for (var i = 0; i < segmentPlayer.totalSegments; ++i) {
    segmentPlayer.requestedSegments[i] = false;
  }	
}
segmentPlayer.setVideo = function () {
	segmentPlayer.video.src = URL.createObjectURL(segmentPlayer.mediaSource);
 	segmentPlayer.mediaSource.addEventListener('sourceopen',segmentPlayer.sourceOpen);
}
segmentPlayer.sourceOpen = function() {
  segmentPlayer.sourceBuffer = segmentPlayer.mediaSource.addSourceBuffer(segmentPlayer.mimeCodec);
  segmentPlayer.getFileLength(this.url,segmentPlayer.fetchFirstSegment);
}

segmentPlayer.getFileLength = function(url, callback) {
  var xhr = new XMLHttpRequest;
  xhr.open('head', url);
  xhr.onload = function () {
    callback(xhr.getResponseHeader('content-length'));
  };
  xhr.send();
}

segmentPlayer.fetchFirstSegment = function(fileLength) {
	console.log('goal');
	    // this.segmentLength = Math.round(fileLength /this.totalSegments);    
    	// this.fetchRange(this.url, 0, this.segmentLength, app.appendSegment);
    	// requestedSegments[0] = true;
    	// app.registerVideoEvent();

	}




segmentPlayer.getFileLength = function(url, callback)  {
    var xhr = new XMLHttpRequest;
    xhr.open('head', url);
    xhr.onload = function () {
      console.log('content whole duration' + xhr.getResponseHeader('content-length'));
      callback(xhr.getResponseHeader('content-length'));
      };
    xhr.send();
  };

segmentPlayer.setfirstsegment = function(fileLength)
{
    console.log('fileLength : ' + fileLength);

    console.log('about mb : ' + (fileLength / 1024 / 1024).toFixed(2), 'MB');


    segmentLength = Math.round(fileLength / totalSegments);

    console.log('each  segmentLength is  : ' + segmentLength);

    app.fetchRange(assetURL, 0, segmentLength, app.appendSegment);

    requestedSegments[0] = true;

    app.registerVideoEvent();
}

segmentPlayer.registerVideoEvent = function ()
{
    video.addEventListener('timeupdate', app.checkBuffer);  
    video.addEventListener('canplay', app.canPlayEvent);  
    video.addEventListener('seeking', app.seek);  
}

segmentPlayer.seek = function (event)
{
   
  if (mediaSource.readyState === 'open') {
    sourceBuffer.abort();
    console.log(mediaSource.readyState);
  } else {
    console.log('seek but not open?');
    console.log(mediaSource.readyState);
  }
}

   
segmentPlayer.canPlayEvent = function ()
{
  console.log('canPlayEvent ');
  console.log('video duration ' + video.duration);
  console.log('totalSegments ' + totalSegments);

   segmentDuration = video.duration / totalSegments;

   console.log('segmentDuration ' +segmentDuration);
   video.play();
}

segmentPlayer.fetchRange =  function  (url, start, end, callback) 
{
    console.log('called fetchRange ');

    var xhr = new XMLHttpRequest;

    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';

    xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);

    xhr.onload = function () {
      bytesFetched += end - start + 1;
      console.log('byetesFetched : ' + bytesFetched);
      console.log('check response ' + xhr.response);
      callback(xhr.response);
    };
    xhr.send();
};

  segmentPlayer.checkBuffer = function  () {
    var currentSegment = app.getCurrentSegment();
    
    console.log('app.shouldFetchNextSegment(currentSegment)'+ app.shouldFetchNextSegment(currentSegment));
    if (currentSegment === totalSegments && app.haveAllSegments()) {
      console.log('last segment', mediaSource.readyState);
      mediaSource.endOfStream();
      video.removeEventListener('timeupdate', app.checkBuffer);
    } 
    else if (app.shouldFetchNextSegment(currentSegment)) {
      requestedSegments[currentSegment] = true;
      console.log('time to fetch next chunk', video.currentTime);
      //bytesfetch는 기준이 된다. 
      app.fetchRange(assetURL, bytesFetched, bytesFetched + segmentLength, app.appendSegment);
    }
    
  };

  segmentPlayer.getCurrentSegment = function()
   {
        console.log(' getCurrentSegment video.currentTime' + video.currentTime);

        console.log(' getCurrentSegment segmentDuration' + segmentDuration);

        console.log(' getCurrentSegment final value ' + (video.currentTime / segmentDuration));
        return ((video.currentTime / segmentDuration) | 0) + 1;
   };
  segmentPlayer.haveAllSegments = function ()
  {
      return requestedSegments.every(function (val)
       { return !!val; });
   };


  segmentPlayer.shouldFetchNextSegment = function(currentSegment) {
    // whole duration  calculate 80% bufferring
    return video.currentTime > segmentDuration * currentSegment * 0.8 &&
      !requestedSegments[currentSegment];
  };



segmentPlayer.checkSupportSource = function ()
{
  var issupport = false;
  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    issupport = true;
  } else
    issupport = false;
} 

 segmentPlayer.appendSegment = function (chunk) 
 {
   console.log('appendSegment');
   sourceBuffer.appendBuffer(chunk);
 };


segmentPlayer.typeB = function ()
{
    console.log('check support mediaSource possibility');
    if(app.checkSupportSource)
    {
      app.init(); 
    } else
      console.error('Unsupported MIME type or codec: ', mimeCodec);
}


segmentPlayer.parsempd = function ()
{
  app.getData(mpdURL);
}

segmentPlayer.getData = function (url) {
  if (url !== "") {
    var xhr = new XMLHttpRequest(); // Set up xhr request
    xhr.open("GET", url, true); // Open the request          
    xhr.responseType = "text"; // Set the type of response expected
    xhr.send();

    //  Asynchronously wait for the data to return
    xhr.onreadystatechange = function () {
      if (xhr.readyState == xhr.DONE) {
        var tempoutput = xhr.response;
        var parser = new DOMParser(); //  Create a parser object 

        // Create an xml document from the .mpd file for searching
        var xmlData = parser.parseFromString(tempoutput, "text/xml", 0);
        console.log("parsing mpd file");
        console.log(xmlData);

        // Get and display the parameters of the .mpd file
        app.getFileType(xmlData);

        // Set up video object, buffers, etc  
        app.setupVideo();

        // Initialize a few variables on reload
       // clearVars();
      }
    }
    // Report errors if they happen during xhr
    xhr.addEventListener("error", function (e) {
      log("Error: " + e + " Could not load url.");
    }, false);
  }
}








  



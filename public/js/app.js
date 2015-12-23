var app = {};

var assetURL = 'assets/frag_bunny.mp4';
var mpdURL = 'assets/live.mpd';

var mediaSource = null;
var sourceBuffer = null;
var mimeCodec = null;
var video = null;


//segment Information.
var segmentLength = 0;
var segmentDuration = 0;
var bytesFetched = 0;
var requestedSegments = [];
var totalSegments = 5;

app.loadStream = function()
{ 
   console.log('loadstream is called from UI');
   app.play();
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

  console.log ("Basic Segments num : " + requestedSegments.length);
  console.log ("We will use 5 segments : " + requestedSegments.length);

  // set url and register souropen event.
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', app.sourceOpen);
  console.log ("Init end");
}

app.sourceOpen = function ()
{
  console.log('sourceOpen is called ');

  //setup sourceBuffer.
   sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

  //Get Whole FileLength : It will get file whole content length and callback to fetch first segments
   app.getFileLength(assetURL , app.setfirstsegment)
}

app.getFileLength = function(url, callback)  {
    var xhr = new XMLHttpRequest;
    xhr.open('head', url);
    xhr.onload = function () {
      console.log('content whole duration' + xhr.getResponseHeader('content-length'));
      callback(xhr.getResponseHeader('content-length'));
      };
    xhr.send();
  };

app.setfirstsegment = function(fileLength)
{
    console.log('fileLength : ' + fileLength);

    console.log('about mb : ' + (fileLength / 1024 / 1024).toFixed(2), 'MB');


    segmentLength = Math.round(fileLength / totalSegments);

    console.log('each  segmentLength is  : ' + segmentLength);

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
  console.log('canPlayEvent ');
  console.log('video duration ' + video.duration);
  console.log('totalSegments ' + totalSegments);

   segmentDuration = video.duration / totalSegments;

   console.log('segmentDuration ' +segmentDuration);
   video.play();
}

app.fetchRange =  function  (url, start, end, callback) 
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

  app.checkBuffer = function  () {
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

  app.getCurrentSegment = function()
   {
        console.log(' getCurrentSegment video.currentTime' + video.currentTime);

        console.log(' getCurrentSegment segmentDuration' + segmentDuration);

        console.log(' getCurrentSegment final value ' + (video.currentTime / segmentDuration));
        return ((video.currentTime / segmentDuration) | 0) + 1;
   };
  app.haveAllSegments = function ()
  {
      return requestedSegments.every(function (val)
       { return !!val; });
   };


  app.shouldFetchNextSegment = function(currentSegment) {
    // whole duration  calculate 80% bufferring
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

 app.appendSegment = function (chunk) 
 {
   console.log('appendSegment');
   sourceBuffer.appendBuffer(chunk);
 };


app.typeB = function ()
{
    console.log('check support mediaSource possibility');
    if(app.checkSupportSource)
    {
      app.init(); 
    } else
      console.error('Unsupported MIME type or codec: ', mimeCodec);
}


app.parsempd = function ()
{
  app.getData(mpdURL);
}

app.getData = function (url) {
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

app.getFileType = function (data) {
  console.log('data : ' + data);
  try {

    file = data.querySelectorAll("BaseURL")[0].textContent.toString();
    console.log('base url '+ file);
    var rep = data.querySelectorAll("Representation");
    console.log('representation '+ rep);

    type = rep[0].getAttribute("mimeType");
    console.log('type '+ type);

    
    console.log('codecs '+ rep[0].getAttribute("codecs"));    
    console.log('width '+ rep[0].getAttribute("width"));    
    console.log('height '+ rep[0].getAttribute("height"));    
    console.log('bandwidth '+ rep[0].getAttribute("bandwidth"));    

    codecs = rep[0].getAttribute("codecs");
    width = rep[0].getAttribute("width");
    height = rep[0].getAttribute("height");
    bandwidth = rep[0].getAttribute("bandwidth");

    var ini = data.querySelectorAll("Initialization");
    console.log('ini' + ini);    

    // initialization = ini[0].getAttribute("range");

    // console.log('initialization' + initialization);    

    segments = data.querySelectorAll("SegmentURL");
    console.log('segments :' + segments);    

    // Get the length of the video per the .mpd file
    //   since the video.duration will always say infinity
    var period = data.querySelectorAll("Period");
    // var vidTempDuration = period[0].getAttribute("duration");
    // vidDuration = parseDuration(vidTempDuration); // display length

    // var segList = data.querySelectorAll("SegmentList");
    // segDuration = segList[0].getAttribute("duration");

  } catch (er) {
   console.log(er);
    return;
  }
  app.showTypes();  // Display parameters 
}

// Display parameters from the .mpd file
app.showTypes = function() {
  var display = document.getElementById("myspan");
  var spanData;
  spanData = "<h3>Reported values:</h3><ul><li>Media file: " + file + "</li>";
  spanData += "<li>Type: " + type + "</li>";
  spanData += "<li>Codecs: " + codecs + "</li>";
  spanData += "<li>Width: " + width + " -- Height: " + height + "</li>";
  spanData += "<li>Bandwidth: " + bandwidth + "</li>";
  // spanData += "<li>Initialization Range: " + initialization + "</li>";
  // spanData += "<li>Segment length: " + segDuration / 1000 + " seconds</li>";
  // spanData += "<li>" + vidDuration + "</li>";
  spanData += "</ul>";
  display.innerHTML = spanData;
  document.getElementById("numIndexes").innerHTML = segments.length;
  document.getElementById("curInfo").style.display = "block";
  document.getElementById("curInfo").style.display = "block";
}

app.setupVideo = function () {
  //  Create the media source 
  console.log('setupVideo')
  
  mediaSource = new MediaSource();
   
  var url = URL.createObjectURL(mediaSource);
  video = document.querySelector('video');
  video.pause();
  video.src = url;
  video.width = width;
  video.height = height;

  // Wait for event that tells us that our media source object is 
  //   ready for a buffer to be added.
  mediaSource.addEventListener('sourceopen', function (e) {
    try {
      var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
      videoSource = mediaSource.addSourceBuffer(mimeCodec);
      app.initVideo(initialization, file);           
    } catch (e) {
      console.log('Exception calling addSourceBuffer for video', e);
      return;
    }
  },false);

}

 app.initVideo = function(range, url) {
  console.log('initvideo iscalled ');
  console.log('initvideo iscalled range: ' + range);
  console.log('initvideo iscalled url : '+ url);

  var xhr = new XMLHttpRequest();
  if (range || url) { // make sure we've got incoming params

    // Set the desired range of bytes we want from the mp4 video file
    xhr.open('GET', url);
    xhr.setRequestHeader("Range", "bytes=" + range);
    segCheck = (timeToDownload(range) * .8).toFixed(3); // use .8 as fudge factor
    xhr.send();
    xhr.responseType = 'arraybuffer';
    try {
      xhr.addEventListener("readystatechange", function () {
         if (xhr.readyState == xhr.DONE) { // wait for video to load
          // Add response to buffer
          try {
            videoSource.appendBuffer(new Uint8Array(xhr.response));
            // Wait for the update complete event before continuing
            videoSource.addEventListener("update",updateFunct, false);

          } catch (e) {
            log('Exception while appending initialization content', e);
          }
        }
      }, false);
    } catch (e) {
      log(e);
    }
  } else {
    return // No value for range or url
  }
}

  



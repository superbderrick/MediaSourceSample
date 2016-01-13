var dashPlayer = {};

// url mpd  file mp4
dashPlayer.url = null;
dashPlayer.mediaSource = null;
dashPlayer.sourceBuffer = null;
dashPlayer.video = null;
dashPlayer.xmlData = null;


// contents Information.
dashPlayer.file = null;  // MP4 file
dashPlayer.mimetype = null;  // Type of file
dashPlayer.codecs = null; //  Codecs allowed
dashPlayer.width = null;  //  native width and height
dashPlayer.height = null;
dashPlayer.bandwidth = null;

dashPlayer.Representation = null;
dashPlayer.Initialization = null;

dashPlayer.segments = null;
dashPlayer.segmentDuration = null;

 //  parameters to drive fetch loop
dashPlayer.segCheck;
dashPlayer.lastTime = 0;
dashPlayer.bufferUpdated = false;
dashPlayer.Index = 0;


dashPlayer.init = function(url, video) {
  console.log(dashPlayer.url );
  dashPlayer.url = url;
  dashPlayer.video = video;
}

dashPlayer.play = function() {
		dashPlayer.parseMPD();    // Parse Start ! 
}

dashPlayer.setVideo = function() {
	dashPlayer.mediaSource = new MediaSource;
  dashPlayer.video.src = URL.createObjectURL(dashPlayer.mediaSource);
  dashPlayer.mediaSource.addEventListener('sourceopen', dashPlayer.sourceOpen);
}

dashPlayer.parseMPD = function() {
	dashPlayer.getData(dashPlayer.url); // Parse MPD data from server .
}

dashPlayer.getData = function(url) {
	var xhr = new XMLHttpRequest(); // Set up xhr 
	xhr.open("GET", dashPlayer.url, true); // Open the request   
	xhr.responseType = "text"; // Set the type of response expected
        xhr.send();       
	xhr.onreadystatechange = function () {
	  if (xhr.readyState == xhr.DONE) {
	    var tempoutput = xhr.response;

	    var parser = new DOMParser(); //  create a parser object 
	    
	    xmlData = parser.parseFromString(tempoutput, "text/xml", 0); //Creates an instance of a document that contains a Document Object Model (DOM) tree from a string of serialized XML source.
     	dashPlayer.getFileType(xmlData);

      dashPlayer.setVideo();
	  }
}

dashPlayer.getFileType = function( data) {
	try {
	var ini = data.querySelectorAll("Initialization"); // get arraytype 
	var segList = data.querySelectorAll("SegmentList");

	dashPlayer.file = "assets/" +(data.querySelectorAll("BaseURL")[0].textContent.toString());
	dashPlayer.Representation = data.querySelectorAll("Representation");
	dashPlayer.mimeType = dashPlayer.Representation[0].getAttribute("mimeType");
  dashPlayer.codecs = dashPlayer.Representation[0].getAttribute("codecs");
  dashPlayer.width = dashPlayer.Representation[0].getAttribute("width");
  dashPlayer.height = dashPlayer.Representation[0].getAttribute("height");
  dashPlayer.bandwidth = dashPlayer.Representation[0].getAttribute("bandwidth");	
	dashPlayer.Initialization = ini[0].getAttribute("range");
	dashPlayer.segments = data.querySelectorAll("SegmentURL");
  dashPlayer.segmentDuration = segList[0].getAttribute("duration");
	}
	catch (error) {
		console.log(error);
	}	
}

dashPlayer.sourceOpen = function() {
		var mimetype = dashPlayer.mimeType + ";" + dashPlayer.codecs
    dashPlayer.sourceBuffer = dashPlayer.mediaSource.addSourceBuffer(mimetype);
    dashPlayer.fetchinitializationSegment(dashPlayer.Initialization ,dashPlayer.file);
}
dashPlayer.fetchinitializationSegment = function(range, url) {
      var xhr = new XMLHttpRequest();
      if (range || url) { 
        xhr.open('GET', url);
        xhr.setRequestHeader("Range", "bytes=" + range);
        xhr.send();
        xhr.responseType = 'arraybuffer';
        try {
          xhr.addEventListener("readystatechange", function () {
             if (xhr.readyState == xhr.DONE) { 
              try {
                dashPlayer.sourceBuffer.appendBuffer(new Uint8Array(xhr.response));
                dashPlayer.sourceBuffer.addEventListener("update",dashPlayer.updateFunct, false);
              } catch (e) {
                console.log('Exception while appending initialization content', e);
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


dashPlayer.updateFunct = function() {
		dashPlayer.bufferUpdated = true;
    dashPlayer.getStarted(dashPlayer.file);
    dashPlayer.sourceBuffer.removeEventListener("update", dashPlayer.updateFunct);
    dashPlayer.video.addEventListener('timeupdate', dashPlayer.checkBuffer);  

}

dashPlayer.getStarted = function(url) {	
	dashPlayer.playSegment(dashPlayer.segments[dashPlayer.Index].getAttribute("mediaRange").toString(), url);
	dashPlayer.video.play();
}


dashPlayer.playSegment = function(range , url) {	
	   var xhr = new XMLHttpRequest();
      if (range || url) { // make sure we've got incoming params
        xhr.open('GET', url);
        xhr.setRequestHeader("Range", "bytes=" + range);
        xhr.send();
        xhr.responseType = 'arraybuffer';
        try {
          xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState == xhr.DONE) {
              try {
                dashPlayer.sourceBuffer.appendBuffer(new Uint8Array(xhr.response));
                dashPlayer.video.play();
                dashPlayer.video.addEventListener('error' , dashPlayer.test);
              } catch (e) {
                console.log('Exception while appending', e);
              }
            }
          }, false);
        } catch (e) {
          log(e);
          return // no value for range
        }
      }

}
}

dashPlayer.checkBuffer = function() {
  var currentSegment = dashPlayer.getCurrentSegment();
  console.log(dashPlayer.segments[dashPlayer.Index].getAttribute("mediaRange").toString());
  console.log(dashPlayer.video.currentTime);
};

dashPlayer.getCurrentSegment = function() {
  //dashPlayer.playSegment(dashPlayer.segments[dashPlayer.Index].getAttribute("mediaRange").toString(), url);
   //return ((dashPlayer.video.currentTime / dashPlayer.segmentDuration) | 0) + 1;
}


   
    
    
 

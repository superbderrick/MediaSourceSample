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
  console.log(url);
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
  console.log("num + " + dashPlayer.segments.length);
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
        // segCheck = (timeToDownload(range) * .8).toFixed(3); // use .8 as fudge factor
        dashPlayer.segCheck = (dashPlayer.timeToDownload(range) * 0.8).toFixed(3);
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
     console.log('range' + range);
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

                console.log('play gogo' + range);
                dashPlayer.segCheck = (dashPlayer.timeToDownload(range) * 0.8).toFixed(3);
                dashPlayer.sourceBuffer.appendBuffer(new Uint8Array(xhr.response));
                dashPlayer.video.play();
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
  console.log('dashPlayer.checkBuffer is called ' + dashPlayer.bufferUpdated);
  if (dashPlayer.bufferUpdated == true) {
     if (dashPlayer.Index < dashPlayer.segments.length) {
       if ((dashPlayer.video.currentTime - dashPlayer.lastTime) >= dashPlayer.segCheck) {
          console.log('needto new fetch');
          dashPlayer.Index++;
          dashPlayer.lastTime = dashPlayer.video.currentTime;
          dashPlayer.playSegment(dashPlayer.segments[dashPlayer.Index].getAttribute("mediaRange").toString(), dashPlayer.file);
       } else {
          dashPlayer.video.removeEventListener("timeupdate", dashPlayer.checkBuffer, false);
       }

     }

  }

};



 dashPlayer.timeToDownload = function(range) {
  var vidDur = range.split("-");
  // Time = size * 8 / bitrate
  console.log(vidDur);
  return (((vidDur[1] - vidDur[0]) * 8) / dashPlayer.bandwidth)
}


   
    
    
 

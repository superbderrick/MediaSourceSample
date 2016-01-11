var dashPlayer = {};

// url mpd fiee file mp4
dashPlayer.url = null;
dashPlayer.mediaSource = null;
dashPlayer.sourceBuffer = null;
dashPlayer.video = null;
dashPlayer.xmlData = null;


// contents Information.
dashPlayer.file = null;  // MP4 file
dashPlayer.mimeType = null;  // Type of file
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
dashPlayer.segLength = 0;





dashPlayer.init = function(url, video) {
    dashPlayer.url = url;
    dashPlayer.video = video;
}

dashPlayer.play = function() {
		dashPlayer.parseMPD();
    
}

dashPlayer.setVideo = function() {
	dashPlayer.mediaSource = new MediaSource;
  dashPlayer.video.src = URL.createObjectURL(dashPlayer.mediaSource);
  dashPlayer.mediaSource.addEventListener('sourceopen', dashPlayer.sourceOpen);
}

dashPlayer.parseMPD = function() {
	dashPlayer.getData(dashPlayer.url);
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

	    // Create an xml document from the .mpd file for searching
	    xmlData = parser.parseFromString(tempoutput, "text/xml", 0);


	    // Get and display the parameters of the .mpd file
	    dashPlayer.getFileType(xmlData);

      dashPlayer.setVideo();
	  }
}

dashPlayer.getFileType = function( data) {
	try {
	var ini = data.querySelectorAll("Initialization");
	var segList = data.querySelectorAll("SegmentList");

	dashPlayer.file = "assets/" +(data.querySelectorAll("BaseURL")[0].textContent.toString());
	console.log(dashPlayer.file);
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
    //temp value
		var tempUrl ='video/mp4; codecs="avc1.4d0020,mp4a.40.2"';
    dashPlayer.sourceBuffer = dashPlayer.mediaSource.addSourceBuffer(tempUrl);
    dashPlayer.fetchinitializationSegment(dashPlayer.Initialization ,dashPlayer.file);

}
dashPlayer.fetchinitializationSegment = function(range, url) {
      var xhr = new XMLHttpRequest();
      if (range || url) { 

        //  set the desired range of bytes we want from the mp4 video file
        xhr.open('GET', url);
        xhr.setRequestHeader("Range", "bytes=" + range);
        dashPlayer.segCheck = (dashPlayer.timeToDownload(range) * .8).toFixed(3); // use .8 as fudge factor        
        xhr.send();
        xhr.responseType = 'arraybuffer';
        try {
          xhr.addEventListener("readystatechange", function () {
             if (xhr.readyState == xhr.DONE) { // wait for video to load
              // add response to buffer
              try {
                dashPlayer.sourceBuffer.appendBuffer(new Uint8Array(xhr.response));
                // Wait for the update complete event before continuing
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

dashPlayer.timeToDownload = function(range) {
		var vidDur = range.split("-");
    // time = size * 8 / bitrate
    return (((vidDur[1] - vidDur[0]) * 8) / dashPlayer.bandwidth)
}

dashPlayer.updateFunct = function() {
	dashPlayer.bufferUpdated = true;
  dashPlayer.getStarted(dashPlayer.file);
  dashPlayer.sourceBuffer.removeEventListener("update", dashPlayer.updateFunct);

    // videoSource.removeEventListener("update", updateFunct);
}

dashPlayer.getStarted = function(url) {
  dashPlayer.playSegment(dashPlayer.segments[dashPlayer.Index].getAttribute("mediaRange").toString(), url);
	dashPlayer.Index++;	
  dashPlayer.video.addEventListener("timeupdate", dashPlayer.fileChecks, false);

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
            if (xhr.readyState == xhr.DONE) { //wait for video to load
              //  Calculate when to get next segment based on time of current one
              //  // dashPlayer.segCheck = (dashPlayer.timeToDownload(range) * .8).toFixed(3); // use .8 as fudge factor        
                dashPlayer.segCheck = (dashPlayer.timeToDownload(range) * .8).toFixed(3); // use .8 as fudge factor
                dashPlayer.segLength.textContent = dashPlayer.segCheck;
              // Add received content to the buffer
              try {
                console.log(dashPlayer.sourceBuffer);
                console.log(new Uint8Array(xhr.response));
                dashPlayer.sourceBuffer.appendBuffer(new Uint8Array(xhr.response));
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

dashPlayer.fileChecks = function() {
// If we're ok on the buffer, then continue
  if (dashPlayer.bufferUpdated == true) {
    if (dashPlayer.Index < dashPlayer.segments.length) {
      //  loads next segment when time is close to the end of the last loaded segment 
      if ((dashPlayer.video.currentTime - dashPlayer.lastTime) >= dashPlayer.segCheck) {
        dashPlayer.playSegment(dashPlayer.segments[dashPlayer.Index].getAttribute("mediaRange").toString(), dashPlayer.file);
        dashPlayer.lastTime = dashPlayer.video.currentTime;
        
        index++;
      }
    } else {
      dashPlayer.video.removeEventListener("timeupdate", dashPlayer.fileChecks, false);
    }
  }
}
}


   
    
    
 

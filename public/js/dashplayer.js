var dashPlayer = {};

// url mpd fiee file mp4
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
    // It has two types of alogorism about buffering.
    // first mstype It need to prameter first is Initialization file and url.
    // 
    console.log(dashPlayer.mediaSource);
    console.log(dashPlayer.mimeType);
    console.log(dashPlayer.codecs);

		var test = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
		//video/mp4;avc1.4d0020,mp4a.40.2
		
		var test1 = dashPlayer.mimeType + ";" + dashPlayer.codecs
		console.log(test);
		console.log(test1);

		var test3 ='video/mp4; codecs="avc1.4d0020,mp4a.40.2"';
    // dashPlayer.sourceBuffer = dashPlayer.mediaSource.addSourceBuffer(dashPlayer.mimeType + ";" + dashPlayer.codecs);
    dashPlayer.sourceBuffer = dashPlayer.mediaSource.addSourceBuffer(test3);
    dashPlayer.fetchinitializationSegment(dashPlayer.Initialization ,dashPlayer.file);

}
dashPlayer.fetchinitializationSegment = function(range, url) {
      var xhr = new XMLHttpRequest();
      if (range || url) { // make sure we've got incoming params

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

    // videoSource.removeEventListener("update", updateFunct);
}

dashPlayer.getStarted = function(url) {
		
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
                segCheck = (timeToDownload(range) * .8).toFixed(3); // use .8 as fudge factor
                segLength.textContent = segCheck;
              // Add received content to the buffer
              try {
                videoSource.appendBuffer(new Uint8Array(xhr.response));
              } catch (e) {
                log('Exception while appending', e);
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


   
    
    
 

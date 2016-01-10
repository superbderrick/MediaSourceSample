var dashPlayer = {};

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




dashPlayer.init = function(url, video) {
    dashPlayer.url = url;
    dashPlayer.video = video;
}

dashPlayer.play = function() {
		dashPlayer.parseMPD();
    
}



dashPlayer.setVideo = function() {
	console.log('setvideo');
	  dashPlayer.mediaSource = new MediaSource;
    dashPlayer.video.src = URL.createObjectURL(dashPlayer.mediaSource);
    dashPlayer.mediaSource.addEventListener('sourceopen', dashPlayer.sourceOpen);
}

dashPlayer.parseMPD = function() {
	dashPlayer.getData(dashPlayer.url);
}

dashPlayer.sourceOpen = function() {
    
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
	    console.log('parset start' + xmlData);

	    // Get and display the parameters of the .mpd file
	    dashPlayer.getFileType(xmlData);

      dashPlayer.setVideo();
	  }
}

dashPlayer.getFileType = function( data) {
	try {
	dashPlayer.file = data.querySelectorAll("BaseURL")[0].textContent.toString();
	dashPlayer.Representation = data.querySelectorAll("Representation");

	dashPlayer.mimeType = dashPlayer.Representation[0].getAttribute("mimeType");
  dashPlayer.codecs = dashPlayer.Representation[0].getAttribute("codecs");
  dashPlayer.width = dashPlayer.Representation[0].getAttribute("width");
  dashPlayer.height = dashPlayer.Representation[0].getAttribute("height");
  dashPlayer.bandwidth = dashPlayer.Representation[0].getAttribute("bandwidth");
	
	var ini = data.querySelectorAll("Initialization");

	dashPlayer.Initialization = ini[0].getAttribute("range");
	dashPlayer.segments = data.querySelectorAll("SegmentURL");


	 

  var segList = data.querySelectorAll("SegmentList");
  dashPlayer.segmentDuration = segList[0].getAttribute("duration");


	}
	catch (error) {
		console.log(error);
	}


	
}


	
}


   
    
    
 

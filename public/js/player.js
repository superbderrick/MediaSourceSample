function Player (url , video) {
	Player.url = url;
	Player.video = video;
}


Player.prototype.testType = 0;
Player.prototype.url = 'assets/frag_bunny.mp4';
Player.prototype.video = null;
Player.prototype.mimCodec = null;
Player.prototype.sourceBuffer = null;


Player.mediaSource = null;
Player.segmentLength = 0;
Player.segmentDuration = 0;
Player.bytesFetched = 0;
Player.requestedSegments = [];
Player.totalSegments = 5;


Player.prototype.init = function () {

	 //Player.createModules();
	 //Player.start();
}

Player.createModules = function () {
	 Player.mediaSource = new MediaSource;
	 Player.mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
}

Player.start = function () {

	 // initialize requestedSegemnts.

  for (var i = 0; i < Player.totalSegments; ++i)
  {
    Player.requestedSegments[i] = false;
  }

  console.log ("Basic Segments num : " + Player.requestedSegments.length);
  
  // set url and register souropen event.
  Player.video.src = URL.createObjectURL(Player.mediaSource);
  Player.mediaSource.addEventListener('sourceopen', Player.sourceOpen);
  console.log ("Init end");

}

Player.sourceOpen = function () {
	  console.log('sourceOpen is called ');

  //setup sourceBuffer.
   Player.sourceBuffer = Player.mediaSource.addSourceBuffer(Player.mimeCodec);

  //Get Whole FileLength : It will get file whole content length and callback to fetch first segments
   Player.getFileLength(assetURL , Player.setfirstsegment)
}

Player.getFileLength = function(url, callback)  {
    var xhr = new XMLHttpRequest;
    xhr.open('head', url);
    xhr.onload = function () {
      
      callback(xhr.getResponseHeader('content-length'));
      };
    xhr.send();
  };

Player.setfirstsegment = function(fileLength)
{
    segmentLength = Math.round(fileLength / totalSegments);
    app.fetchRange(assetURL, 0, segmentLength, app.appendSegment);

    requestedSegments[0] = true;

    app.registerVideoEvent();
}






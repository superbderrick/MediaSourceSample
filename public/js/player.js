function Player (url , video) {
	this.url = url;
	this.video = video;
	
}


Player.prototype.testType = 0;
Player.prototype.url = 'assets/frag_bunny.mp4';
Player.prototype.video = null;

Player.prototype.mimCodec = null;
Player.mediasource = null;


Player.segmentLength = 0;
Player.segmentDuration = 0;
Player.bytesFetched = 0;
Player.requestedSegments = [];
Player.totalSegments = 5;



Player.prototype.init = function () {
	 this.createModules();
	 this.start();
}

Player.prototype.createModules = function () {
	 this.mediaSource = new MediaSource;
	 this.mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
}

Player.prototype.start = function () {
	
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






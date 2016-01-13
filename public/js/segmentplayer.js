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


segmentPlayer.init = function(url , video) {
	segmentPlayer.url = url;
  segmentPlayer.video = video;
}

segmentPlayer.play = function () {
	segmentPlayer.createModule();
  segmentPlayer.initializeSegments();
  segmentPlayer.setVideo();
}

segmentPlayer.createModule = function() {
	segmentPlayer.mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
 	segmentPlayer.mediaSource = new MediaSource;
}

segmentPlayer.initializeSegments = function() {
  for (var i = 0; i < segmentPlayer.totalSegments; ++i) {
    segmentPlayer.requestedSegments[i] = false;
  }	
}

segmentPlayer.setVideo = function() {
	segmentPlayer.video.src = URL.createObjectURL(segmentPlayer.mediaSource);
 	segmentPlayer.mediaSource.addEventListener('sourceopen',segmentPlayer.sourceOpen);
}

segmentPlayer.sourceOpen = function() {
  segmentPlayer.sourceBuffer = segmentPlayer.mediaSource.addSourceBuffer(segmentPlayer.mimeCodec);
  segmentPlayer.getFileLength(segmentPlayer.url , segmentPlayer.fetchFirstSegment);
}

segmentPlayer.getFileLength = function(url, callback) {
  var xhr = new XMLHttpRequest;
  xhr.open('head', url);
  xhr.onreadystatechange = function () {
    if(xhr.readyState == xhr.DONE) {
      callback(xhr.getResponseHeader('content-length'));
    }
  };
  
  xhr.send();
}

segmentPlayer.fetchFirstSegment = function(fileLength) {
	console.log(fileLength);
  segmentPlayer.segmentLength = Math.round(fileLength /segmentPlayer.totalSegments);    
	segmentPlayer.fetchRange(segmentPlayer.url, 0, segmentPlayer.segmentLength, segmentPlayer.appendSegment);
	segmentPlayer.requestedSegments[0] = true;
	segmentPlayer.registerVideoEvents();
}

segmentPlayer.registerVideoEvents = function() {
  segmentPlayer.video.addEventListener('timeupdate', segmentPlayer.checkBuffer);  
  segmentPlayer.video.addEventListener('canplay', segmentPlayer.canPlayEvent);  
}

segmentPlayer.getCurrentSegment = function() {
  return ((segmentPlayer.video.currentTime / segmentPlayer.segmentDuration) | 0) + 1;
};

segmentPlayer.appendSegment = function (chunk) {
  segmentPlayer.sourceBuffer.appendBuffer(chunk);
};

segmentPlayer.seek = function (event) {
  if (mediaSource.readyState === 'open') {
    sourceBuffer.abort();
    console.log(mediaSource.readyState);
  } else {
    console.log('seek but not open?');
    console.log(mediaSource.readyState);
  }
}

segmentPlayer.canPlayEvent = function() {
	console.log('canPlayEvent ');
	console.log('video Duration ' + segmentPlayer.video.duration);
	console.log('totalSegments ' + segmentPlayer.totalSegments);

	 segmentPlayer.segmentDuration = segmentPlayer.video.duration / segmentPlayer.totalSegments;

	 console.log('segmentDuration ' +segmentPlayer.segmentDuration);
	 segmentPlayer.video.play();
}

segmentPlayer.fetchRange = function(url, start, end, callback) {
	console.log('fetchRange is called ');
  var xhr = new XMLHttpRequest;
  xhr.open('get', url);
  xhr.responseType = 'arraybuffer';
  xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);

  xhr.onreadystatechange = function () {
    if(xhr.readyState == xhr.DONE) {
        segmentPlayer.bytesFetched += end - start + 1;
        callback(xhr.response);
    }
  }
  xhr.send();
};

segmentPlayer.checkBuffer = function() {
	var currentSegment = segmentPlayer.getCurrentSegment();
	console.log('app.shouldFetchNextSegment(currentSegment)'+ segmentPlayer.shouldFetchNextSegment(currentSegment));

	if(currentSegment === segmentPlayer.totalSegments && segmentPlayer.haveAllSegments()) {
	  segmentPlayer.mediaSource.endOfStream();
	  segmentPlayer.video.removeEventListener('timeupdate', app.checkBuffer);
	} 
	else if (segmentPlayer.shouldFetchNextSegment(currentSegment)) {
	  segmentPlayer.requestedSegments[currentSegment] = true;
	  console.log('time to fetch next chunk', segmentPlayer.video.currentTime);
	  //bytesfetch는 기준이 된다. 
	  segmentPlayer.fetchRange(segmentPlayer.url, segmentPlayer.bytesFetched, segmentPlayer.bytesFetched + segmentPlayer.segmentLength, segmentPlayer.appendSegment);
	}
  
};

segmentPlayer.getCurrentSegment = function() {
  console.log(' getCurrentSegment video.currentTime' + segmentPlayer.video.currentTime);

  console.log(' getCurrentSegment segmentDuration' + segmentPlayer.segmentDuration);

  console.log(' getCurrentSegment final value ' + (segmentPlayer.video.currentTime / segmentPlayer.segmentDuration));
  return ((segmentPlayer.video.currentTime / segmentPlayer.segmentDuration) | 0) + 1;
};

segmentPlayer.haveAllSegments = function() {
  return segmentPlayer.requestedSegments.every(function (val)
   { return !!val; });
};

segmentPlayer.shouldFetchNextSegment = function(currentSegment) {
	return segmentPlayer.video.currentTime > segmentPlayer.segmentDuration * currentSegment * 0.8 &&
	  !segmentPlayer.requestedSegments[currentSegment];
};

segmentPlayer.appendSegment = function(chunk) {
  segmentPlayer.sourceBuffer.appendBuffer(chunk);
};











  



var app = {};

app.init = null;
app.loadstream = null ;
app.typeA = null;

var assetURL = 'assets/frag_bunny.mp4';
var mediaSource = null;
var mimeCodec = null;
var video = null;

app.loadStream = function()
{
	this.init();
};

app.init = function ()
{
	app.typeB();
};

app.typeA = function ()
{
	 video = document.querySelector('video');
     mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

     app.issupport();
}

app.sourceopen = function () {
	   var mediaSource = this;
       var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
       console.log(assetURL);

        app.fetchAB(assetURL, function (buf) {

          sourceBuffer.addEventListener('updateend', function (_) {
            mediaSource.endOfStream();
            video.play();
          });
          sourceBuffer.appendBuffer(buf);
        });
}

app.fetchAB = function(url , cb) {
		console.log('fetchAB');
        var xhr = new XMLHttpRequest;
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
        	console.log(cb);
        	console.log(xhr.response);
          cb(xhr.response);
        };
        xhr.send();
}

app.issupport = function ()
{
	 if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        mediaSource = new MediaSource;

        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', app.sourceopen);
      } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec);
      }
}


app.typeB = function ()
{
	 var video = document.querySelector('video');
      
      var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
      var totalSegments = 5;
      var segmentLength = 0;
      var segmentDuration = 0;
      var bytesFetched = 0;
      var requestedSegments = [];
      for (var i = 0; i < totalSegments; ++i) requestedSegments[i] = false;
      var mediaSource = null;
      if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        mediaSource = new MediaSource;
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen);
      } else {
        console.error('Unsupported MIME type or codec: ', mimeCodec);
      }


      var sourceBuffer = null;
      function sourceOpen (_) {
        sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

        getFileLength(assetURL, function (fileLength) {
          console.log((fileLength / 1024 / 1024).toFixed(2), 'MB');
          segmentLength = Math.round(fileLength / totalSegments);
          fetchRange(assetURL, 0, segmentLength, appendSegment);
          requestedSegments[0] = true;
          video.addEventListener('timeupdate', checkBuffer);
          video.addEventListener('canplay', function () {
            segmentDuration = video.duration / totalSegments;
            video.play();
          });
          video.addEventListener('seeking', seek);
        });
      };
      function getFileLength (url, cb) {
        var xhr = new XMLHttpRequest;
        xhr.open('head', url);
        xhr.onload = function () {
            cb(xhr.getResponseHeader('content-length'));
            console.log(xhr.getResponseHeader('content-length'));
          };
        xhr.send();
      };

      function fetchRange (url, start, end, cb) {
        var xhr = new XMLHttpRequest;
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);
        xhr.onload = function () {
          console.log('fetched bytes: ', start, end);
          bytesFetched += end - start + 1;
          cb(xhr.response);
        };
        xhr.send();
      };
      function appendSegment (chunk) {
        sourceBuffer.appendBuffer(chunk);
      };
      function checkBuffer (_) {
        var currentSegment = getCurrentSegment();
        if (currentSegment === totalSegments && haveAllSegments()) {
          console.log('last segment', mediaSource.readyState);
          mediaSource.endOfStream();
          video.removeEventListener('timeupdate', checkBuffer);
        } else if (shouldFetchNextSegment(currentSegment)) {
          requestedSegments[currentSegment] = true;
          console.log('time to fetch next chunk', video.currentTime);
          fetchRange(assetURL, bytesFetched, bytesFetched + segmentLength, appendSegment);
        }
        //console.log(video.currentTime, currentSegment, segmentDuration);
      };
      function seek (e) {
        console.log(e);
        if (mediaSource.readyState === 'open') {
          sourceBuffer.abort();
          console.log(mediaSource.readyState);
        } else {
          console.log('seek but not open?');
          console.log(mediaSource.readyState);
        }
      };
      function getCurrentSegment () {
        return ((video.currentTime / segmentDuration) | 0) + 1;
      };
      function haveAllSegments () {
        return requestedSegments.every(function (val) { return !!val; });
      };
      function shouldFetchNextSegment (currentSegment) {
        return video.currentTime > segmentDuration * currentSegment * 0.8 &&
          !requestedSegments[currentSegment];
      };
}




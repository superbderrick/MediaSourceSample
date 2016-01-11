var BasePlayer = new Player();

BasePlayer.url;
BasePlayer.video = null;
BasePlayer.mediaSource = null;
BasePlayer.sourceBuffer = null;

BasePlayer.mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ;

BasePlayer.init = function(url, video) {
	BasePlayer.video = video;
}

BasePlayer.start = function() {
 if ('MediaSource' in window && MediaSource.isTypeSupported(BasePlayer.mimeCodec)) {
      BasePlayer.mediaSource = new MediaSource;

      console.log(BasePlayer.mediaSource.readyState); // closed

      BasePlayer.video.src = URL.createObjectURL(BasePlayer.mediaSource); //

      BasePlayer.mediaSource.addEventListener('sourceopen', BasePlayer.sourceOpen); //  
    } else {
      console.error('Unsupported MIME type or codec: ', BasePlayer.mimeCodec);
    }	
}

BasePlayer.sourceOpen = function() {
	BasePlayer.sourceBuffer = BasePlayer.mediaSource.addSourceBuffer(BasePlayer.mimeCodec);	
	BasePlayer.fetchSegment(BasePlayer.url , BasePlayer.updateEnd);
}

BasePlayer.fetchSegment = function(url , callback) {
	var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.send();
}

BasePlayer.updateEnd = function(chunk) {
  BasePlayer.sourceBuffer.appendBuffer(chunk);
	BasePlayer.sourceBuffer.addEventListener('updateend' , BasePlayer.checkStatus);
}

BasePlayer.checkStatus = function() {
  console.log('checkstatus');
	BasePlayer.mediaSource.endOfStream();
  video.play();
}



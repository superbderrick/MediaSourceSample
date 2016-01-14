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

 if ( MediaSource.isTypeSupported(BasePlayer.mimeCodec)) { // check support mime type.

      BasePlayer.mediaSource = new MediaSource; // step 1 Create Mediasource Object. 

      BasePlayer.video.src = URL.createObjectURL(BasePlayer.mediaSource); 
      // step 2 Attach it to a video element and Create a virtual URL using createObjectURL with the MediaSource object as the source.      
      BasePlayer.mediaSource.addEventListener('sourceopen', BasePlayer.sourceOpen); //  Register source openevent. 
    } else {
      console.error('Unsupported MIME type or codec: ', BasePlayer.mimeCodec);
    }	
}

BasePlayer.sourceOpen = function() {
	BasePlayer.sourceBuffer = BasePlayer.mediaSource.addSourceBuffer(BasePlayer.mimeCodec);	// step4 Create a SourceBuffer using addSourceBuffer, with the mime type of the video you're adding. 
	BasePlayer.fetchSegment(BasePlayer.url , BasePlayer.updateEnd);
}

BasePlayer.fetchSegment = function(url , callback) {
	var xhr = new XMLHttpRequest;
    xhr.open('GET', url , true); //request type url async type
    xhr.responseType = 'arraybuffer';
    xhr.send();

    //0 (uninitialized) – xmlHttpRequest 객체 생성 완료
    // (loading) – connection open status.
    // (loaded) – data send complete
    // (interactive) – comunication with server
    // (complete) – coplete
    xhr.onreadystatechange = function () {
      if(xhr.readyState == xhr.DONE) {
        callback(xhr.response);
      }

    }
    
}

BasePlayer.updateEnd = function(chunk) {
  BasePlayer.sourceBuffer.appendBuffer(chunk); //step5 Appends the specified media segment to the SourceBuffer.
	BasePlayer.sourceBuffer.addEventListener('updateend' , BasePlayer.play);
}

BasePlayer.play = function() {
  BasePlayer.mediaSource.endOfStream(); // Signals the end of the stream.
  video.play();
}



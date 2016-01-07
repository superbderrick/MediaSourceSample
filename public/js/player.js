function Player (demotype,url , video) {
  Player.demoType = demotype;
	Player.url = url;
	Player.video = video;
}

Player.prototype.url = 'assets/frag_bunny.mp4';
Player.prototype.video = null;
Player.prototype.mimeCodec =  'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
Player.prototype.sourceBuffer = null;


Player.prototype.init = function () {
	 Player.start();
}

Player.createModules = function () {
	 Player.mediaSource = new MediaSource;
	 Player.mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
}

Player.start = function () {
  
    Player.video.src = Player.url;  
    if(Player.video.paused) {
      Player.video.play();
    }
}





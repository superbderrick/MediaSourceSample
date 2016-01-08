function Player (url , video) {
	Player.url = url;
	Player.video = video;
}

Player.prototype.url = 'assets/frag_bunny.mp4';
Player.prototype.video = null;


Player.prototype.init = function () {
	 Player.start();
}


Player.start = function () {
	Player.video.src = Player.url;  
	
	if(Player.video.paused) {
	  	Player.video.play();
	}
}







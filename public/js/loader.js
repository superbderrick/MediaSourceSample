var Loader = function (demotype ,url , video) {
	this.url = url;
	this.video = video;
	this.demoType = demotype;

	this.load = function () {

		if(demotype == 0) {
			var player = new Player(this.url ,this.video);
	 		player.init();
		}
		else if(demotype == 1) {
			var segmentPlayer = new SegmentPlayer(this.url,this.video); 
			segmentPlayer.init();
		}
	};

}


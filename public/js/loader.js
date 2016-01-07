var Loader = function (demotype ,url , video) {
	this.url = url;
	this.video = video;
	this.demoType = demotype;

	this.load = function () {

		if(demotype == 0) {
			var player = new Player(this.demoType,this.url ,this.video);
	 		player.init();
		}
	};

}


var Loader = function (demotype ,url , video) {
	console.log(demotype);
	console.log(url);
	console.log(video);

	this.url = url;
	this.video = video;
	this.demoType = demotype;

	this.load = function () {

		if(demotype == 0) {
			var player = new Player(this.url ,this.video);
	 		player.init();
		}
	};

	// this.load = function(this.demotype , this.url , this.video)
	// {
	// 	if (this.demotype == 0) {
	// 		var player = new Player(url , video);
	// 		player.init();
	// 	};


	// };

}


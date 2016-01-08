var Loader = function (demotype ,url , video) {
	this.url = url;
	this.video = video;
	this.demoType = demotype;

	this.load = function () {
		// console.log(module.publicMethod()); // 1
		// if(demotype == 0) {
		// 	var player = new Player(this.url ,this.video);
	 // 		player.init();
		// }
		 if(demotype == 0) {
			segmentPlayer.init(this.url ,this.video);
			segmentPlayer.play();
		}

		

	};

}


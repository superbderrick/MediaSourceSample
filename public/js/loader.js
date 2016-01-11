var Loader = function(demotype, url, video) {
    this.url = url;
    this.video = video;

    this.load = function() {
        if (demotype == 'VIDEOTAG') {
            var player = new Player(this.url, this.video);
            player.init();
        } else if (demotype == 'MEDIASOURCE') {
            BasePlayer.init(this.url, this.video);
            BasePlayer.start();
        } else if (demotype == 'MEDIASOURCE_SEGMENT') {
            segmentPlayer.init(this.url, this.video);
            segmentPlayer.play();
        } else if (demotype == 'MEDIASOURCE_DASH_SEGMENTLIST') {
            dashPlayer.init(this.url, this.video);
            dashPlayer.play();
        } else if (demotype == 'MEDIASOURCE_DASH_SEGMENTTEMPLATE') {
            //segmentPlayer.init(this.url ,this.video);
            //segmentPlayer.play();
        }
    };

}

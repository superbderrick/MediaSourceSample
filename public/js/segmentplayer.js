function SegmentPlayer (url , video) {
    this.url = url;
    this.video = video;
    this.mediaSource = null;
    this.sourceBuffer = null;
	this.segmentLength = 0;
	this.segmentDuration = 0;
	this.bytesFetched = 0;
	this.requestedSegments = [];
	this.totalSegments = 5;

	this.init = function () {
		this.createModule();
	}

	this.start = function() {

	}   
	this.createModule = function () {
		
	} 

};


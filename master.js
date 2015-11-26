var Master = function(config){
	config       = config || {};
	this.cluster = config.cluster;
};
// create a worker
Master.prototype.createWorker = function(){
	var worker = this.cluster.fork();
};

Master.prototype.onWorkerCreate = function(worker, address){
	console.log('worker #' + worker.id + ' is now connected to localhost:' + address.port);
};

// when worker dies
Master.prototype.onWorkerExit = function(worker){
	console.log('worker #' + worker.id + ' died');
	var master = this;
	// recreate the worker after 500 milliseconds
	setTimeout(function(){
		master.createWorker();
	}, 500);
};
// export module
module.exports = Master;
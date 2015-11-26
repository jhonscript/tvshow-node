// include the cluster module
var cluster = require('cluster');
// code to run if we're in the master process
if (cluster.isMaster) {
    // start master with the cluster
    var Master   = require('./master');
    var master   = new Master({cluster:cluster});
    // master create a worker for each CPU
    var cpuCount = require('os').cpus().length;

    console.log('Master cluster setting up ' + cpuCount + ' workers...');

    for (var i = 0; i < cpuCount; i += 1){
        master.createWorker();
    }

    cluster.on('listening', function(worker, address) {
        master.onWorkerCreate(worker, address);
    });

    // listen for dying workers
    cluster.on('exit', function(worker){
        master.onWorkerExit(worker);
    });
// code to run if we're in a worker process
} else {
    // start worker
    var Workers = require('./workers');
    var workers = new Workers(cluster.worker.id);
    workers.run();
}
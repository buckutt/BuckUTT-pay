///////////////////////
// SIGHUP Management //
///////////////////////

var cluster = require('cluster');

console.log('Master started with PID ' + process.pid);

//fork the first process
cluster.fork();

process.on('SIGHUP', function () {
    console.log('Reloading...');

    var new_worker = cluster.fork();

    new_worker.once('listening', function () {
        //stop all other workers
        for(var id in cluster.workers) {
            if (id === new_worker.id.toString()) {
                continue;
            }
            cluster.workers[id].kill('SIGTERM');
        }
    });

});
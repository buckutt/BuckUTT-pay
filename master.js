///////////////////////
// SIGHUP Management //
///////////////////////

'use strict';

var cluster = require('cluster');

console.log('Master started with PID ' + process.pid);

var globalPwd;

// Forks the first process
var firstWorker = cluster.fork();

firstWorker.on('message', function (msg) {
    globalPwd = msg;
});

firstWorker.send(false);

process.on('SIGHUP', function () {
    console.log('Reloading...');

    var newWorker = cluster.fork();

    newWorker.once('listening', function () {
        // Stops all other workers
        for(var id in cluster.workers) {
            if (cluster.workers.hasOwnProperty(id)) {
                if (id === newWorker.id.toString()) {
                    continue;
                }
                cluster.workers[id].kill('SIGTERM');
            }
        }
    });

    if (globalPwd) {
        newWorker.send(globalPwd);
    }
});

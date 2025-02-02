const cluster = require('cluster');
console.log(`master pid=${process.pid}`);
// override application entry point.
cluster.setupMaster({
    exec: __dirname + '/producer-http-basic.js'
});
// create workers.
cluster.fork();
cluster.fork();

// listen to cluster events.
cluster
    .on('disconnect', (worker) => {
        console.log('disconnect', worker.id);
    })
    .on('exit', (worker, code, signal) => {
        console.log('exit', worker.id, code, signal);
        // create new worker after worker process exists.
        // cluster.fork();
    })
    .on('listening', (worker, {address, port}) => {
        console.log('listening', worker.id, `${address}:${port}`);
    })
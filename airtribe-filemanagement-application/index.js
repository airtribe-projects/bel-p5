const fs = require('fs');


// Read sync, write sync
// Read sync, write async
// Read async, write sync
// Read async, write async

function readWriteSync() {
    console.log('Reading and writing the file synchronously');
    let data = fs.readFileSync('./AFM-source/input.txt', {encoding: 'utf-8', flag: 'r'});
    console.log(`Reading the file has completed sync ${data}`);
    fs.writeFileSync('./AFM-destination/output.txt',data, {encoding: 'utf-8', flag: 'w'})
    console.log('Reading and writing to the file sync has finished');
}

function readSyncWriteAsync() {
    console.log('Reading sync and writing the file async');
    let data = fs.readFileSync('./AFM-source/input.txt', {encoding: 'utf-8', flag: 'r'});
    console.log(`Reading the file has completed sync ${data}`);
    fs.writeFile('./AFM-destination/output.txt', data, {encoding: 'utf-8', flag: 'w'}, function(err, data) {
        if(err) {
            console.log('Writing to the file has failed');
        }
        else {
            console.log('Writing to the file async has finished');
        }
    });
    console.log('Reading sync and writing to the file async has finished');
}

function readAsyncWriteSync() {
    console.log('Reading async and writing the file sync');
    for(let i=0;i<10000000000;i++) {

    }
    fs.readFile('./AFM-source/input.txt', {encoding: 'utf-8', flag: 'r'}, function(err, data) {
        if(err) {
            console.log("Reading the file has failed");
        } else {
            fs.writeFileSync('./AFM-destination/output.txt',data, {encoding: 'utf-8', flag: 'w'});
        }
    });
    console.log('Reading async and writing to the file sync has finished');

}

let now = Date.now();
setTimeout(function() {
    console.log('Inside set timeout');
    console.log(`This executed in ${Date.now() - now}`);
}, 0);

//readWriteSync();
//readSyncWriteAsync();
readAsyncWriteSync();
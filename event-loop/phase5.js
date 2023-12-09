let {airQualityCallback, airQualityPromise} = require('./airQualityHelper');

let url = 'https://api.openaq.org/v2/latest';

console.log("hello");

for(let i=0;i<100;i++) {
    console.log("Inside loop");
}

process.nextTick(() => {
    console.log("inside next tick");
}); 

setImmediate(() => {
    console.log("Inside set immediate");
});

airQualityPromise(url).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

for(let i=0;i<100;i++) { 
    Promise.resolve().then(res => {
        console.log("resolved");
    });
}
const timeout = Date.now();
setTimeout(() => {
    const delay = Date.now() - timeout;
    console.log("inside timeout");
    console.log("Executed after ", delay);
}, 4000);

console.log("end");
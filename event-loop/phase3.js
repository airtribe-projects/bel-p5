console.log("hello");

for(let i=0;i<100;i++) {
    console.log("Inside loop");
}

process.nextTick(() => {
    console.log("inside next tick");
    let current = Date.now();
    while(Date.now() - current < 100000) {

    }
}); 

const timeout = Date.now();
setTimeout(() => {
    const delay = Date.now() - timeout;
    console.log("inside timeout");
    console.log("Executed after ", delay);
}, 0);

console.log("end");
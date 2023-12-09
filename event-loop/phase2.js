console.log("hello");

for(let i=0;i<100;i++) {
    console.log("Inside loop");
}

process.nextTick(() => {
    console.log("inside next tick");
}); 

console.log("end");
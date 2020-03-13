const Blockchain = require('./blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = []; 

for (let i=0; i<10000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    
    blockchain.addBlock({data: `block ${i}`});
    
    nextBlock = blockchain.chain[blockchain.chain.length-1];

    nextTimestamp = nextBlock.timestamp;
    
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = (times.reduce( (a, b) => a+b))/times.length;

    console.log(`time to mine block: ${timeDiff}ms`, `difficulty: ${nextBlock.difficulty}`, `Average: ${average}ms`);
}
const Block = require('./block')
const cryptoHash = require('./crypto-hash')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });
        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }
        
        for(let i=1; i<chain.length; i++) {
            const currentBlock = chain[i];

            const previousBlock = chain[i-1]; 

            const {timestamp, hash, data, lastHash} = currentBlock;
            
            if(currentBlock.lastHash !== previousBlock.hash ) return false

            const validHash =  cryptoHash(timestamp, lastHash, data);

            if(hash !== validHash) return false;
        }

        return true;
    }
}

module.exports = Blockchain;
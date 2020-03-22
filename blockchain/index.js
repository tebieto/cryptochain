const Block = require('./block')
const { cryptoHash } = require('../util/')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });
        
        this.chain.push(newBlock);
    }

    replaceChain(chain, onSuccess) {
    if (chain.length <= this.chain.length) return console.error('The incoming chain must be longer');

    if(!Blockchain.isValidChain(chain)) return console.error('The incoming chain is invalid');

    if(onSuccess) onSuccess();
    console.log('replacing the chain with', chain);
    this.chain = chain;
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }
        
        for(let i=1; i<chain.length; i++) {
            const {timestamp, hash, data, lastHash, nonce, difficulty} = chain[i];

            const previousBlock = chain[i-1];

            const difficultyDiff = previousBlock.difficulty - difficulty;

            if(lastHash !== previousBlock.hash ) return false;

            const validHash =  cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if(hash !== validHash) return false;

            if(Math.abs(difficultyDiff) > 1) return false;
        }

        return true;
    }
};

module.exports = Blockchain;
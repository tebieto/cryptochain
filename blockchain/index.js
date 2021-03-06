const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet')
const { cryptoHash } = require('../util/');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

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

    replaceChain(chain, validateTransaction, onSuccess) {
    if (chain.length <= this.chain.length) return console.error('The incoming chain must be longer');

    if (!Blockchain.isValidChain(chain)) return console.error('The incoming chain is invalid');
    
    if ( validateTransaction && !this.validTransactionData({ chain })) {
        console.error('The incoming chain has invalid data');
        return
    }

    if (onSuccess) onSuccess();
    console.log('replacing the chain with', chain);
    this.chain = chain;
    }

    validTransactionData({ chain }) {

        let validAmount = false;
        for (let i=chain.length-1; i>0; i--) {
            const block = chain[i];
            const transactionSet = new Set();
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if(transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceed limit');
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Mining Reward exceeds limit');
                        return false;
                    }
                } else {
                    if(!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction');
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });


                    if(!validAmount && transaction.input.amount === trueBalance) {
                        validAmount = true;
                    }

                    if (transactionSet.has(transaction)) {
                        console.error('An identical transaction appears more than once in the block');
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }

        if(!validAmount) {
            console.error("Invalid input amount");
            return false;
        }
        return true;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }
        
        for(let i=1; i<chain.length; i++) {
            const {timestamp, hash, data, lastHash, nonce, difficulty} = chain[i];

            const previousBlock = chain[i-1];

            const difficultyDiff = previousBlock.difficulty - difficulty;

            if (lastHash !== previousBlock.hash ) return false;

            const validHash =  cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validHash) return false;

            if (Math.abs(difficultyDiff) > 1) return false;
        }

        return true;
    }
};

module.exports = Blockchain;
const redis  = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub {
    constructor({ blockchain, transactionPool, redisUrl }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.publisher = redis.createClient(redisUrl);
        this.subscriber = redis.createClient(redisUrl);

        this.subscribeToChanels();

        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
        const parsedMessage = JSON.parse(message);
        const validateTransactions = true;
        
        switch(channel) {
            case (CHANNELS.BLOCKCHAIN):
            this.blockchain.replaceChain(parsedMessage, validateTransactions, () => {
                this.transactionPool.clearBlockchainTransactions({ 
                    chain: parsedMessage 
                });
            }); 
            break;
            case (CHANNELS.TRANSACTION): 
            this.transactionPool.setTransaction(parsedMessage);
            break;
        }
    }

    subscribeToChanels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({channel, message}) {
        this.subscriber.unsubscribe(channel, () => {   
            this.publisher.publish(channel, message, () => {
                setTimeout(() => {    
                    this.subscriber.subscribe(channel);
                },1000);
            });
        });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
};

module.exports = PubSub;


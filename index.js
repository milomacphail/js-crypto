const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(timestamp, payerAddress, payeeAddress, amount){
    this.timestamp = timestamp;
    this.payerAddress = payerAddress;
    this.payeeAddress = payeeAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = this.timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.previousHash = this.previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) + this.nonce ).toString();
  }

  mineBlock( difficulty) {
    let count = 0;
    while( this.hash.substring(0, difficulty) !== Array( difficulty + 1).join("0") ) {
      this.nonce++;
      count++;
      this.hash = this.calculateHash();
    }
    console.log("Block successfully hashed "+ count + " iterations).  Hash: " + this.hash);
  }

}

class Blockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 3;
    this.unminedTxns = [];
    this.miningReward = 50;
    this.createGenesisBlock();
    this.registeredAddresses = [ 'wallet-Alice', 'wallet-Bob', 'wallet-Charlie', 'wallet-Milo'];
    this.airdropCoins(100);
  }

  airdropCoins(coins){
    for (const address of this.registeredAddresses){
      let txn = new Transaction( Date.now(), "mint", address, coins );
      this.unminedTxns.push(txn);
    }
    this.mineCurrentBlock('wallet-Milo');
  }
  

  createGenesisBlock() {
    let txn = new Transaction( Date.now(), "mint", "genesis", 0);
    let block = new Block(Date.now(), [txn], "0");
    this.chain.push(block);
  }

  mineCurrentBlock (minerAddress) {
    let validatedTxns =[];
    for (const txn of this.unminedTxns){
      if( txn.payerAddress === "mint" || this.validateTransaction(txn)){
        validatedTxns.push(txn);
      }
    }
    console.log("transactions validated: " + validatedTxns.length);

    let block = new Block( Date.now() , this.validatedTxns, this.getLatestBlock().hash);
    block.mineBlock( this.difficulty );
    console.log("Current block successfully mined!");
    this.chain.push(block);
    this.unminedTxns = [
      new Transaction(Date.now(), "mint", minerAddress, this.miningReward)
    ];
  }

  validateTransaction( txn ) {
    this.payerAddress = txn.payerAddress;
    this.balance = this.getAddressBalance( payerAddress);
      if (balance >= txn.amount) {
        return true;
      } else {
        return false;
      }
  }

  createTransaction( txn ) {
    this.unminedTxns.push(txn);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getAddressBalance ( address ) {
    let balance = 0;

    for(const block of this.chain){
      for(const txn of block.transactions) {
          if(txn.payerAddress === address){
            balance -= txn.amount;
          }
          if(txn.payeeAddress === address){
            balance += txn.amount;
          }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let miloCoin = new Blockchain();

miloCoin.mineCurrentBlock("wallet-milo");
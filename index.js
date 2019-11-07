const SHA256 = require("crypto-js/sha256");

class Transaction{
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
  }

  createGenesisBlock() {
    let txn = new Transaction( Date.now(), "mint", "genesis", 0);
    let block = new Block(Date.now(), [txn], "0");
    this.chain.push(block);
  }
  mineCurrentBlock (minerAddress) {
    let block = new Block(Date.now(), this.unminedTxns, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    console.log("Current block successfully mined!");
    this.chain.push(block);

    this.unminedTxns = [];
      new Transaction(Date.now(), "mint", minerAddress, this.miningReward);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  createTransaction( txn ) {
    this.unminedTxns.push(txn);
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



console.log("Mining new block...");
miloCoin.createTransaction(new Transaction(Date.now(), "wallet-Alice", "wallet-Bob", 50) );
miloCoin.createTransaction(new Transaction(Date.now(), "wallet-Bob", "wallet-Alice", 25) );

console.log("Mining a block!");
miloCoin.mineCurrentBlock("wallet-Minr49er");

console.log("\nBalance: Alice: ", miloCoin.getAddressBalance("wallet-Alice") );
console.log("\nBalance: Bob: ", miloCoin.getAddressBalance("wallet-Bob") );
console.log("\nBalance: Minr49er: ", miloCoin.getAddressBalance("wallet-Minr49er") );
const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = this.timestamp;
    this.data = data;
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
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "15/01/2019", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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

let demoChain = new Blockchain();



console.log("Mining new block...");
demoChain.addBlock(
  new Block(1, "15/02/2018", {
    amount: 10
  })
);
console.log("Mining new block...");
demoChain.addBlock(
  new Block(2, "02/26/2018", {
    amount: 25
  })
);

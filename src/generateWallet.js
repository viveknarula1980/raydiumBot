const { Keypair } = require("@solana/web3.js");

const wallet = Keypair.generate();

console.log("Public key :- ", wallet.publicKey.toBase58());
console.log("Private key :- ", `[${wallet.secretKey.toString()}]`);
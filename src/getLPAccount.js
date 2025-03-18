const { Connection, PublicKey } = require("@solana/web3.js");
const { getAssociatedTokenAddressSync } = require("@solana/spl-token");
require("dotenv").config();

const RPC_URL = process.env.RPC_URL || "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_URL, "confirmed");

const WALLET_ADDRESS = new PublicKey("FeLs7BZciDEXdqxhMiobfBtrnbfX9vT8gGtMPqw4KTyH");  // 🔹 Replace with your wallet
const LP_TOKEN_MINT = new PublicKey("mntP9jUVHFn1yUQPhXpCzp2WsnsJbz9aJR5axymBuJU");  // 🔹 Replace with LP mint address

async function findLPTokenAccount() {
    const lpTokenAccount = getAssociatedTokenAddressSync(LP_TOKEN_MINT, WALLET_ADDRESS);
    console.log("Your LP Token Account Address:", lpTokenAccount.toBase58());
}

findLPTokenAccount();

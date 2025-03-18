const  { Connection, PublicKey } = require ("@solana/web3.js");
const { getAccount } = require("@solana/spl-token");
require("dotenv").config();


// Load RPC URL from .env file
const RPC_URL = process.env.RPC_URL || "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_URL, "confirmed");

// Replace with the actual LP token account address
const LP_TOKEN_ACCOUNT = new PublicKey("79sUhhw3PJFfaMVZoLXaSYQeK1sQaVagYVtaEjDNoR67");

async function getLPBalance() {
    try {
        const accountInfo = await getAccount(connection, LP_TOKEN_ACCOUNT);
        console.log(`LP Token Balance: ${accountInfo.amount}`);
    } catch (error) {
        console.error("Error fetching LP balance:", error);
    }
}

getLPBalance();

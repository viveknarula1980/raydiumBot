const { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const { Liquidity, LiquidityPoolKeys, TOKEN_PROGRAM_ID } = require("@raydium-io/raydium-sdk");
require("dotenv").config();

// Load environment variables
const RPC_URL = "https://api.mainnet-beta.solana.com"
const WALLET_SECRET = "[239,49,198,213,211,164,217,184,252,100,240,23,241,136,108,193,231,102,228,35,54,179,23,212,120,194,22,219,115,148,31,247,121,91,200,234,14,241,204,194,137,220,24,158,13,49,40,225,140,169,241,144,34,193,217,63,57,187,225,250,122,96,23,160]"

const POOL_ADDRESS = "3ucNos4NbumPLZNWztqGHNFFgkHeRMBQAVemeeomsUxv"
const SWAP_THRESHOLD = 0.05

console.log(RPC_URL);
console.log(WALLET_SECRET);
console.log(POOL_ADDRESS);
console.log(SWAP_THRESHOLD);
// Ensure environment variables are set
if (!RPC_URL || !WALLET_SECRET || !POOL_ADDRESS) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

// Initialize Solana connection
const connection = new Connection(RPC_URL, "confirmed");

// Convert private key string to Uint8Array
const wallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(WALLET_SECRET)));

// Convert pool address string to PublicKey
const poolAddress = new PublicKey(POOL_ADDRESS);

console.log("Using Pool Address:", poolAddress.toBase58());
console.log("Swap Threshold:", SWAP_THRESHOLD);
console.log("RPC URL:", RPC_URL);

// Function to fetch LP token balances
async function fetchLPBalances() {
  try {
    console.log("Fetching");
    const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys: poolAddress });
    const poolState = await Liquidity.fetchInfo({ connection, poolInfo });
    console.log("✅ LP Token Mint Address:", poolInfo.lpMint.toBase58());
    console.log("✅ LP Token Vault Address:", poolInfo.lpVault.toBase58());

    if (!poolState) {
      throw new Error("Invalid pool state.");
    }

    const tokenA = poolState.baseReserve.toNumber();
    const tokenB = poolState.quoteReserve.toNumber();
    const ratio = tokenA / tokenB;

    console.log(`Token A: ${tokenA}, Token B: ${tokenB}, Ratio: ${ratio}`);
    return { tokenA, tokenB, ratio, poolInfo };
  } catch (error) {
    console.error("Error fetching LP balances:", error);
    return null;
  }
}

// Function to rebalance liquidity
async function rebalance() {
  const balances = await fetchLPBalances();
  if (!balances) return;

  const { tokenA, tokenB, ratio, poolKeys } = balances;
  const idealRatio = 1.0; // Target balance ratio
  const imbalance = Math.abs(ratio - idealRatio);

  if (imbalance > SWAP_THRESHOLD) {
    const swapDirection = ratio > idealRatio ? "A_to_B" : "B_to_A";
    console.log(`Imbalance detected: ${imbalance}. Swapping ${swapDirection}`);
    await executeSwap(poolKeys, swapDirection);
  } else {
    console.log("LP is balanced, no action needed.");
  }
}

// Function to execute swap
async function executeSwap(poolKeys, direction) {
  try {
    const { innerTransaction } = await Liquidity.makeSwapInstructionSimple({
      connection,
      poolKeys,
      userKeys: {
        tokenAccountIn: wallet.publicKey, // You need to get actual associated token accounts
        tokenAccountOut: wallet.publicKey,
        owner: wallet.publicKey,
      },
      amountIn: 1000000, // Example amount in lamports
      minAmountOut: 0, // Accept any output
      direction: direction === "A_to_B" ? 0 : 1,
    });

    // Build and send transaction
    const transaction = new Transaction().add(innerTransaction);
    transaction.feePayer = wallet.publicKey;
    const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);

    console.log("Swap executed successfully. Tx Signature:", signature);
  } catch (error) {
    console.error("Swap failed:", error);
  }
}

// Run in a loop to monitor and rebalance every 30 seconds
setInterval(async () => {
  await rebalance();
}, 30000);

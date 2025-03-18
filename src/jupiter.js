import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Jupiter, RouteInfo } from "@jup-ag/api";

const connection = new Connection(clusterApiUrl("devnet"));

async function getSwapRoute(inputMint, outputMint, amount) {
    const jupiter = await Jupiter.load({ connection, cluster: "devnet" });

    const route = await jupiter.computeRoutes({
        inputMint, 
        outputMint, 
        amount, 
        slippageBps: 50 // 0.5% slippage
    });

    console.log("Best Swap Route:", route.routesInfos[0]);
}

getSwapRoute(
    "PANDA_MINT_ADDRESS", // Your Panda Token
    "So11111111111111111111111111111111111111112", // SOL
    1000000000 // Amount in smallest unit
);

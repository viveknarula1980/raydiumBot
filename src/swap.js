const axios = require("axios");

const getQuote = async () => {
  const inputMint = "So11111111111111111111111111111111111111112"; // SOL
  const outputMint = "mntP9jUVHFn1yUQPhXpCzp2WsnsJbz9aJR5axymBuJU"; // Your token (e.g., PANDA)
  const amount = 0.1 * 10 ** 9; // 0.1 SOL in lamports

  try {
    const response = await axios.get(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`
    );

    console.log("Best Quote:", response.data);
  } catch(error) {
    console.log("Error fetching quote:" , error);
  }
};

getQuote();

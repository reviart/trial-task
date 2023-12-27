require('dotenv').config();

const envVars = process.env;

const config = {
  etherscan: {
    network: envVars.ETHERSCAN_NETWORK,
    token: envVars.ETHERSCAN_TOKEN,
  },
  binance: {
    apiUrl: envVars.BINANCE_API_URL,
  },
};

module.exports = config;

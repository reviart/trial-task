const Web3 = require('web3');
const axios = require('axios').default;

const CustomError = require('./error');
const erc20Network = 'https://api.etherscan.io';
const erc20AppTokenKey = 'XAJ23367D74RU8JBY2RUTVUF7V9X3BZ2NF';

// Additional functions
function validateErc20Address(walletAddress = '') {
  if (!walletAddress) {
    throw new CustomError({ code: 400, message: 'Wallet address required!' });
  }
  if (walletAddress && walletAddress.length !== 42) {
    throw new CustomError({
      code: 400,
      message: 'ERC20 wallet address should be 42-character hexadecimal!'
    });
  }
}

// Main functions
async function getBalances(walletAddress) {
  const hasError = validateErc20Address(walletAddress);
  if (hasError) return hasError;

  const url = `${erc20Network}/api?module=account&action=balance&address=${walletAddress}&apikey=${erc20AppTokenKey}`;
  const response = await axios.get(url);
  const { data } = response;

  const result = {};
  if (data.message && data.message === 'OK') {
    result.balance = await Web3.utils.fromWei(data.result, 'ether');
    result.positions = await getPositions(result.balance);
  } else {
    throw new CustomError(data);
  }

  return result;
}

async function getTransactions(walletAddress) {
  const hasError = validateErc20Address(walletAddress);
  if (hasError) return hasError;

  const url = `${erc20Network}/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${erc20AppTokenKey}`;
  const response = await axios.get(url);
  const { data } = response;
  
  let result = {};
  if (data.message && data.message === 'OK') {
    result = data.result;
  } else {
    throw new CustomError(data);
  }

  return result;
}

async function getPositions(weiAmount = '0') {
  const pairSymbols = ['USDT', 'USDC', 'BTC'];
  const url = 'https://api.binance.com/api/v3/ticker/price?symbol=ETH';

  const result = [];
  await Promise.all(
    pairSymbols.map(async (pair) => {
      const response = await axios.get(`${url}${pair}`);
      const { data } = response;
      const quantity = +data.price * +weiAmount;

      result.push({
        symbol: pair,
        quantity: quantity.toFixed(8),
      });
    })
  );

  return result;
}

module.exports = {
  getBalances,
  getTransactions,
};

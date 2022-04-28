const {
  getBalances,
  getTransactions,
} = require('./utils');

async function main() {
  try {
    const response = {};
    let wallet = '';

    // Input
    const myArgs = process.argv.slice(2);
    if ((myArgs[0] && myArgs[0] === '--wallet') && myArgs[1]) {
      wallet = myArgs[1];
    } else {
      console.log('Please use this command: node src/index.js --wallet yourEthErc20WalletAddress');
      return;
    }

    // Process
    const [balanceAndPositions, transactions] = await Promise.all([
      getBalances(wallet),
      getTransactions(wallet),
    ]);
    Object.assign(response, { ...balanceAndPositions, transactions: transactions, });

    // Output
    console.log('========== Result ==========');
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

main();
const ethers = require("ethers");
const axios = require("axios");
const vaultABI = require("./ABI");

require("dotenv").config();

const REBALANCE_TOPIC =
  "0xabe03b5f0f266d0f4d29722dcc68a47d9163b25692a06b8821d2d9e990b462ba";

const retrieveData = async () => {
  let timeToRebalance = 0;

  const ethersProvider = new ethers.providers.InfuraProvider(
    "mainnet",
    process.env.INFURA_KEY
  );

  const fetchURL = `https://api.etherscan.io/api?module=account&action=tokentx&address=${process.env.VAULT_ADDRESS}&sort=asc&apikey=${process.env.ETHERSCAN_KEY}`;

  const {
    data: { result }
  } = await axios.get(fetchURL);

  const receipt = await ethersProvider.getTransactionReceipt(result[3].hash);
  const processedActivity = receipt.logs
    .filter(({ topics }) => topics.some((it) => it === REBALANCE_TOPIC))
    .map(({ transactionHash, blockNumber }) => ({
      title: "Rebalanced",
      transactionHash,
      poolPercent: 100,
      yieldAmount: 0,
      blockNumber
    }));

  const lastIndex = processedActivity.length - 1;

  if (processedActivity?.[lastIndex]?.blockNumber) {
    const rebalancedBlock = await ethersProvider.getBlock(
      processedActivity[lastIndex].blockNumber
    );
    timeToRebalance =
      14 -
      Math.floor(
        (new Date() - new Date(rebalancedBlock.timestamp * 1000)) / 86400000
      );
  }

  const vault = new ethers.Contract(
    process.env.VAULT_ADDRESS,
    vaultABI,
    ethersProvider
  );

  const lowerTickPrice = (1e12 / 1.0001 ** (await vault.limitLower())).toFixed(
    2
  );
  const upperTickPrice = (1e12 / 1.0001 ** (await vault.limitUpper())).toFixed(
    2
  );

  return {
    timeToRebalance,
    lowerTickPrice,
    upperTickPrice
  };
};

module.exports = retrieveData;

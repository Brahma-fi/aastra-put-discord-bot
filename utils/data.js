const ethers = require("ethers");
const axios = require("axios");
const vaultABI = require("./ABI");

require("dotenv").config();

const LATEST_REBALANCE_ENDPOINT =
  "https://gydmt4yrah.execute-api.ap-south-1.amazonaws.com/prod/latest_rebalance";

const retrieveData = async () => {
  const ethersProvider = new ethers.providers.InfuraProvider(
    "mainnet",
    process.env.INFURA_KEY
  );

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

  const {
    data: { timestamp }
  } = await axios.get(LATEST_REBALANCE_ENDPOINT);

  return {
    timeToRebalance:
      14 - Math.floor((new Date() - new Date(timestamp)) / 86400000),
    lowerTickPrice,
    upperTickPrice
  };
};

module.exports = retrieveData;

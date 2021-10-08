const Discord = require("discord.js");
const RetrieveData = require("./utils/data");

const TWO_DAYS_IN_SECONDS = 172800;

const getDataAndSetStatus = async () => {
  const { lowerTickPrice, timeToRebalance, upperTickPrice } =
    await RetrieveData();
  client.user.setActivity(
    `Time to re-balance (expiry): ${timeToRebalance} day${
      timeToRebalance > 1 ? "s" : ""
    } | Range (USD): ${lowerTickPrice} - ${upperTickPrice}`
  );
  console.log({ lowerTickPrice, upperTickPrice, timeToRebalance });
};

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  getDataAndSetStatus();
  setInterval(async () => {
    await getDataAndSetStatus();
  }, TWO_DAYS_IN_SECONDS);
});

client.login(process.env.BOT_TOKEN);

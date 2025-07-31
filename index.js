// Make sure you have discord.js installed:
// npm install discord.js

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
require("dotenv").config();

// Your Dark Souls server channel structure with emojis and topics
const categories = require("./categories.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = process.env.DISCORD_BOT_TOKEN; // Put your bot token in .env file

const guildId = process.env.GUILD_ID; // Discord server ID

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = await client.guilds.fetch(guildId);
  if (!guild) {
    console.error("Guild not found");
    process.exit(1);
  }

  for (const categoryData of categories) {
    // Create category if not exists
    let category = guild.channels.cache.find(
      (ch) => ch.name === categoryData.name && ch.type === 4
    );
    if (!category) {
      category = await guild.channels.create({
        name: categoryData.name,
        type: 4, // Category
      });
      console.log(`Created category ${category.name}`);
    }

    // Create channels inside the category
    for (const chData of categoryData.channels) {
      let channel = guild.channels.cache.find(
        (ch) =>
          ch.name === chData.name &&
          ch.parentId === category.id &&
          ch.type === (chData.type === "GUILD_VOICE" ? 2 : 0)
      );
      if (!channel) {
        channel = await guild.channels.create({
          name: chData.name,
          type: chData.type === "GUILD_VOICE" ? 2 : 0,
          topic: chData.topic || undefined,
          parent: category.id,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
        });
        console.log(`Created channel ${channel.name} in ${category.name}`);
      }
    }
  }

  console.log("All channels created!");
  process.exit(0);
});

client.login(token);

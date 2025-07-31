// Make sure you have discord.js installed:
// npm install discord.js

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = process.env.DISCORD_BOT_TOKEN; // Put your bot token in .env file

const guildId = process.env.GUILD_ID; // Replace with your Discord server ID

// Your Dark Souls server channel structure with emojis and topics
const categories = [
  {
    name: "📜 Info",
    channels: [
      { name: "📖 rules", type: "GUILD_TEXT", topic: "Read this. Or perish." },
      {
        name: "📢 announcements",
        type: "GUILD_TEXT",
        topic: "Updates, news, events.",
      },
      {
        name: "🛠️ mod-setup",
        type: "GUILD_TEXT",
        topic: "How to install Seamless Co-op (with links and help)",
      },
    ],
  },
  {
    name: "💀 Community",
    channels: [
      {
        name: "💬 general",
        type: "GUILD_TEXT",
        topic: "Talk about DS, games, life, the void",
      },
      {
        name: "⚙️ builds",
        type: "GUILD_TEXT",
        topic: "Show off your messed-up strength/mage hybrids",
      },
      {
        name: "🧠 lore",
        type: "GUILD_TEXT",
        topic: "Try to make sense of it all",
      },
      {
        name: "📸 memes-and-screenshots",
        type: "GUILD_TEXT",
        topic: "Ridiculous deaths welcome",
      },
      {
        name: "🌀 off-topic",
        type: "GUILD_TEXT",
        topic: "For when the Darksoul™ brainrot fades",
      },
    ],
  },
  {
    name: "⚔️ Co-op Matchmaking",
    channels: [
      { name: "🌍 lfg-eu", type: "GUILD_TEXT" },
      { name: "🌎 lfg-na", type: "GUILD_TEXT" },
      { name: "🌐 lfg-elsewhere", type: "GUILD_TEXT" },
      { name: "📅 schedule-a-run", type: "GUILD_TEXT" },
      { name: "🔊 voice-1", type: "GUILD_VOICE" },
      { name: "🔊 voice-2", type: "GUILD_VOICE" },
    ],
  },
  {
    name: "🗡️ Identity",
    channels: [
      {
        name: "🙋 introduce-yourself",
        type: "GUILD_TEXT",
        topic: "Just say your build or your pain",
      },
      {
        name: "🧩 pick-your-roles",
        type: "GUILD_TEXT",
        topic: "Pick your region, playstyle, and maybe sanity level",
      },
    ],
  },
];

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

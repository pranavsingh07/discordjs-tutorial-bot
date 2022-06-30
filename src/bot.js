require("dotenv").config();

const { Client, Intents, WebhookClient } = require("discord.js");
const client = new Client({
  partials: ["MESSAGE", "REACTION"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});
const webhookClient = new WebhookClient({
  id: process.env.WEBHOOK_ID,
  token: process.env.WEBHOOK_TOKEN,
});
const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has loggged in.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "kick") {
      if (!message.member.permissions.has("KICK_MEMBERS"))
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0) return message.reply("Please provide an id");
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) => message.channel.send("I cannot kick that user :("));
      } else {
        message.channel.send("That member was not found");
      }
    } else if (CMD_NAME === "ban") {
      if (!message.member.permissions.has("BAN_MEMBERS"))
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0) return message.reply("Please provide an id");

      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send("User was banned successfully");
      } catch (err) {
        message.channel.send(
          "An error ocurred. Either i do not have permissions or the user was not found"
        );
      }
    } else if (CMD_NAME === "announce") {
      const msg = args.join(" ");
      webhookClient.send(msg);
    } else if (CMD_NAME === "joke") {
      const jokes = [
        "What do kids play when their mom is using the phone? Bored games.",
        "What’s the smartest insect? A spelling bee!",
        "How does the ocean say hi? It waves!",
        "Why was 6 afraid of 7? Because 7,8,9.",
        "Why did the computer get sick? It caught a virus!",
      ];
      message.channel.send(`${jokes[Math.round(Math.random() * 5)]}`);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "991391110104613065") {
    switch (name) {
      case "😁":
        member.roles.add("991390324779925544");
        break;
      case "😎":
        member.roles.add("991390410612154408");
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "991391110104613065") {
    switch (name) {
      case "😁":
        member.roles.remove("991390324779925544");
        break;
      case "😎":
        member.roles.remove("991390410612154408");
        break;
    }
  }
});

client.on("guildMemberAdd", (member) => {
  member.client.channels
    .fetch("991838662872547398")
    .then((channel) => channel.send(`Welcome ${member.user.username}!`));
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

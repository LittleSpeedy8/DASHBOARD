const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, ChannelType, Partials, PermissionFlagsBits } = require('discord.js');
const fs = require("fs");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildPresences], partials: [Partials.Message, Partials.GuildMessageReactions, Partials.Channel, Partials.MessageReactionAdd, Partials.MessageReactionRemove, Partials.Reaction]
});

module.exports = client;
require("dotenv").config();

const functions = fs.readdirSync("./src/functions").filter((file) => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

client.commands = new Collection();
client.cooldown = new Collection();

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(process.env.token);
})();

// ==== SERVER === //

// server.js
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const path = require('path');
const fetch = require('node-fetch');


require("dotenv").config();

const app = express();

// Set EJS as view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'dashboard', 'views')); // Ensure correct path for views

// Static files (CSS, JS, etc.)
app.use('/js', express.static('src/dashboard/js'));
app.use('/css', express.static('src/dashboard/css'));
app.use(express.static('public'));



// Passport setup for Discord authentication
passport.use(new DiscordStrategy({
  clientID: process.env.ClientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL,
  scope: ['identify', 'guilds', 'guilds.members.read'],
}, function(accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Session configuration
app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: "thisismysecretkey",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Home route
const moment = require('moment'); // You can use the 'moment' library to format time


// Main route - index
app.get("/", (req, res) => {
  if (req.user) {
    req.user.profileImage = req.user.avatar
      ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
      : '/images/default-profile.png';
  }

  let totalMembers = 0;
  client.guilds.cache.forEach(guild => {
    totalMembers += guild.memberCount;
  });

  // Calculate the bot's uptime in a readable format
  const uptime = moment.duration(client.uptime).humanize();

  return res.render("index", { user: req.user, bot: client, totalMembers, uptime });
});

// Endpoint to get bot uptime in JSON format
app.get("/bot-uptime", (req, res) => {
  const uptime = client.uptime; // Get the uptime in milliseconds
  return res.json({ uptime });
});


// Login route (redirect to Discord OAuth)
app.get("/login", passport.authenticate("discord"));

// Callback route (Discord OAuth callback)
app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), function (req, res) {
  res.redirect("/"); // After successful login, redirect to home
});

// Dashboard route
app.get("/dashboard", async (req, res) => {
  if (!req.user) return res.redirect("/login");

  let guilds = Array.isArray(req.user.guilds) ? req.user.guilds.filter(g => g.permissions & 8) : [];
  return res.render("dashboard", { user: req.user, guilds, bot: client }); // Pass client to the template
});

// Fetch Guild Info (for guilds page)
async function fetchGuildInfo(guildId) {
  try {
    const guild = await client.guilds.fetch(guildId);
    return {
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
      roleCount: guild.roles.cache.size,
      stickerCount: guild.stickers.size,
      emojiCount: guild.emojis.cache.size,
      icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
    };
  } catch (error) {
    console.error('Error fetching guild info:', error);
    return null;
  }
}

// Guild dashboard route (specific guild info)
app.get("/dashboard/:guildId", async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const guildId = req.params.guildId;

  const guildInfo = await fetchGuildInfo(guildId);
  if (!guildInfo) {
    return res.status(500).send("Unable to fetch guild info.");
  }

  return res.render("guild-dashboard", {
    user: req.user,
    guild: guildInfo,
    bot: client // Pass bot client to the template
  });
});

// Real-time API to get guild emojis
app.get("/api/getGuildEmojis/:guildId", async (req, res) => {
  const guildId = req.params.guildId;
  try {
    const guild = await client.guilds.fetch(guildId);
    const emojis = guild.emojis.cache.map(emoji => emoji.name);
    res.json({ emojis });
  } catch (error) {
    console.error("Error fetching emojis:", error);
    res.status(500).json({ error: "Failed to fetch emojis." });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); // Redirect to home after logout
  });
});

// 404 route for any undefined routes
app.get("*", (req, res) => {
  res.status(404).render("404", { user: req.user, bot: client }); // Send 404 status code and render the 404 page
});

// Start server
const port = 1500;
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
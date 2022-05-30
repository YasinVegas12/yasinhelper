const { Intents } = require("discord.js");
const config = require("./config.json");

const YasinHelperClient = require("./structures/YasinHelperClient.js");

const intents = new Intents();

intents.add(
    `GUILD_MEMBERS`,
    `GUILDS`,
    `GUILD_MESSAGES`,
    `GUILD_MESSAGE_REACTIONS`,
    `GUILD_BANS`,
    `GUILD_EMOJIS_AND_STICKERS`,
    `DIRECT_MESSAGES`
);

const client = new YasinHelperClient(config, {
    intents: intents,
    disableMentions: "everyone",
    partials: ['CHANNEL']
});

function launch() {
    client.login(client.token);
    client.loadDataBase();
    client.loadEvents();
    client.loadCommands();
    client.loadTriggers();
}

launch();

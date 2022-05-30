const { ShardingManager } = require('discord.js');
const { token } = require('./src/config.json');

const manager = new ShardingManager(`./src/bot.js`, { 
    token: token,
    totalShards: 2,
    respawn: true,
});

manager.on('shardCreate', shard => console.log(`Launch shard number [${shard.id}]...`));
manager.spawn();

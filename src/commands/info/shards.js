const { MessageEmbed} = require("discord.js");
const ms = require("ms");
const lang = require("../../language.json");

module.exports = {
    name: "shards",
	description: "Посмотреть статистику шардов бота",
    description_en: "View the statistics of the bot's shards",
    description_ua: "Переглянути статистику шардів бота",
    usage: "shards",
    example: "/shards",
    example_en: "/shards",
    example_ua: "/shards",
  async run(client,message,args,langs) {
      try {
        let full_memory = (process.memoryUsage().rss / (1000 * 1000)).toFixed(2)
        let current_memory = (process.memoryUsage().heapUsed / (1000 * 1000)).toFixed(2)
        let current_memory_two = full_memory - current_memory

        let used_memory = [ current_memory_two.toFixed(2), current_memory ]

        client.shard.broadcastEval(client => client.guilds.cache.size).then(guilds => {
            client.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)).then(users => {
                client.shard.broadcastEval(client => client.channels.cache.size).then(channels => {
                    client.shard.broadcastEval(client => client.emojis.cache.size).then(emojis => {
                        client.shard.broadcastEval(client => client.ws.ping).then(ping => {
                            client.shard.fetchClientValues('uptime').then(uptime => {
                                const embed = new MessageEmbed()
                                    .setAuthor({ name: `${client.user.username} - Shards`, iconURL: client.user.avatarURL() })
                                    .setFooter({ text: `${lang.requested_by[langs]} ${message.author.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true})}` })
                                for  (let tt = 0; tt < guilds.length; tt++){
                                    embed.addField(`${lang.shards[langs]} #${tt} ${tt == message.guild.shard.id ? `[ ${lang.shard_current[langs]} ]` : " "}`,`<:server:976145578503327755> ${lang.shard_servers[langs]} \`${guilds[tt].toLocaleString()}\`\n<:users:977097893540401182> ${lang.shard_users[langs]} \`${users[tt].toLocaleString()}\`\n<:type:976146556380135544> ${lang.shard_channels[langs]} \`${channels[tt].toLocaleString()}\`\n<:emoji:977098889926676521> ${lang.shard_emojis[langs]} \`${emojis[tt].toLocaleString()}\`\n<:memory:977092737918709760> ${lang.shard_memory[langs]} \`${used_memory[tt].toLocaleString()}\`\n<:clock:976149588299874324> ${lang.shard_uptime[langs]} \`${ms(uptime[tt])}\`\n<:hear:977100839661482014> ${lang.shard_ping[langs]} \`${ping[tt].toLocaleString()}MS\``, true)
                                }
                                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                            });
                        });
                    });
                });
            });
        });
    } catch (e) {
        console.log(e)          
    }
  }
}
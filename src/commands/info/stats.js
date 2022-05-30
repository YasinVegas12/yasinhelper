const { MessageEmbed, version } = require("discord.js");
const lang = require("../../language.json");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "stats",
    description: "Посмотреть статистику бота",
    description_en: "View bot statistics",
    description_ua: "Переглянути статистику бота",
    usage: "stats",
    example: "/stats",
    example_en: "/stats",
    example_ua: "/stats",
  async run(client,message,args,langs) {

        try {

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        
        const proces = (process.memoryUsage().rss / (1000 * 1000)).toFixed(2)
        client.nagruzka = proces

        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            client.shard.fetchClientValues('channels.cache.size'),
            client.shard.fetchClientValues('emojis.cache.size'),
            client.shard.broadcastEval(client => client.nagruzka),
        ];

        return Promise.all(promises)
            .then(results => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
            const totalChannels = results[2].reduce((acc, channels) => acc + channels, 0);
            const totalEmojis = results[3].reduce((acc, emojis) => acc + emojis, 0);
            const totalMB = results[4].reduce((shard1, shard2) => Number(shard1) + Number(shard2));
        
            let embed = new MessageEmbed()
            .setTitle(`${lang.stats_title[langs]}`)
            .setColor(`#428df5`)
            .setThumbnail(client.user.avatarURL())
            .addField(`${lang.stats_local[langs]}`, `<:server:976145578503327755> | ${lang.stats_servers[langs]} - \`${totalGuilds}\`\n<:users:977097893540401182> ${lang.stats_users[langs]} - \`${totalMembers}\`\n<:shards:976146083635937360> | ${lang.shards_stats[langs]} - \`${client.shard.count}\`\n<:type:976146556380135544> | ${lang.stats_channels[langs]} - \`${totalChannels}\`\n<:emoji:977098889926676521> | ${lang.stats_emoji[langs]} - \`${totalEmojis}\``)
            .addField(`${lang.stats_hosting[langs]}`, `<:type:976146556380135544> | OS - \`Ubuntu 16.04.1 LTS\`\n<:memory:977092737918709760> | ${lang.stats_memory[langs]} - \`${totalMB} MB\`\n<:clock:976149588299874324> | Uptime - \`${duration}\`\n<a:note:976150101397491732> | ${lang.stats_commands[langs]} - \`${client.commands.size}\``)
            .addField(`${lang.stats_versions[langs]}`, `<:discord:976150488414298142> | Discord.JS - \`${version}\`\n<:nodejs:976150688499396628> | Node.JS - \`${process.version}\``)
            .setTimestamp()
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        })
        } catch(e) {
            console.log(e)
        }
    }
}
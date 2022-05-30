const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client,ban) => {
    try {
      
        let data = await Guild.findOne({
            guildID: ban.guild.id
        });
      
        if (!data) return;

        let langs = data.language

        if (!ban.guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

        const logchannel = await ban.guild.channels.cache.find(c => c.name === data.channels.guildBanAdd) || ban.guild.channels.cache.find(c => c.id === data.channels.guildBanAdd)

        if (!logchannel) return;

        if (!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

        const entry = await ban.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());

        let member = await ban.guild.members.fetch(entry.executor.id);

        if(entry.reason === null) {
            reason = `${lang.reason_no_provide[langs]}`
        }else{
            reason = entry.reason
        }

        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " days" : " days") + " ago";
        };

        let registed = ban.user.createdAt.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false });

        let banEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.guild_ban_add_title[langs]}`)
        .setThumbnail(`${ban.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
        .addField(`${lang.channel_create_information[langs]}`, `${lang.guild_ban_add_user[langs]} ${ban.user} (\`${ban.user.tag}\` / \`${ban.user.id}\`)\n${lang.guild_ban_add_created[langs]} [UTC+3]: **${registed}** (${checkDays(ban.user.createdAt)})`)
        .addField(`${lang.guild_ban_add_who[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
        .addField(`${lang.reason_caps[langs]}`, `${reason}`)
        .setFooter({ text: `${lang.guild_ban_add_timestamp[langs]}` })
        .setTimestamp()

        logchannel.send({ embeds: [banEmbed] });
    } catch(e) {
        console.log(e)
    }
}
const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client,member) => {

  if(member.user.bot) return;

  try {

    let data = await Guild.findOne({
        guildID: member.guild.id
    });

    if (!data) return;

    let langs = data.language

    const guild = client.guilds.cache.get(member.guild.id);

    if (!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

    const entry = await guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());

    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " days" : " days") + " ago";
    };

    let vxodchannel = data.vxodchannel
    let channel = member.guild.channels.cache.find(c => c.name == vxodchannel) || member.guild.channels.cache.find(c => c.id == vxodchannel);

    let registed = member.user.createdAt.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false });

    if(channel) {
        if(!channel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;
        if (entry.target.id === member.id
        && (entry.createdTimestamp > (Date.now() - 5000))) {

            if(entry.reason === null) {
                reason = `${lang.reason_no_provide[langs]}`
            }else{
                reason = entry.reason
            }

            let memberKick = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.guild_member_remove_kick_title[langs]}`)
            .addField(`${lang.channel_create_information[langs]}`, `${lang.guild_ban_add_user[langs]} ${member} (\`${member.user.tag}\` / \`${member.id}\`)\n${lang.guild_ban_add_created[langs]} [UTC +3]: **${registed}** (${checkDays(member.user.createdAt)})`)
            .addField(`${lang.guild_member_who_kicked[langs]}`, `<@${entry.executor.id}> (\`${entry.executor.tag}\` / \`${entry.executor.id}\`)`)
            .addField(`${lang.reason_caps[langs]}`, `${reason}`)
            .setFooter({ text: `${lang.guild_member_kicked_timestamp[langs]}` })
            .setTimestamp()
            channel.send({ embeds: [memberKick] }).catch(err => {})
        }else{
            let joindate = member.joinedAt.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false });

            let embed = new MessageEmbed()
            .setColor(`#fc0303`)
            .setTitle(`${lang.guild_member_remove_title[langs]}`)
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .addField(`${lang.channel_create_information[langs]}`, `${lang.guild_ban_add_user[langs]} ${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
            .addField(`${lang.account_joined[langs]}`, `${joindate} (${checkDays(member.joinedAt)})`)
            .addField(`${lang.account_created[langs]}`, `${registed} (${checkDays(member.user.createdAt)})`)
            .setTimestamp()
            channel.send({ embeds: [embed] }).catch(err => {})
        }
    }
    } catch(e) {
        console.log(e)
    }
}
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

    let autorole = data.autorole
    let role = member.guild.roles.cache.find(r => r.name == autorole) || member.guild.roles.cache.find(r => r.id == autorole);

    if (role) member.roles.add(role).catch(err => {})

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
        let embed = new MessageEmbed()
        .setColor(`#03fc45`)
        .setTitle(`${lang.member_guild_add_title[langs]}`)
        .addField(`${lang.channel_create_information[langs]}`, `${lang.guild_ban_add_user[langs]} ${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
        .addField(`${lang.account_created[langs]}`, `${registed} (${checkDays(member.user.createdAt)})`)
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setTimestamp()
        channel.send({ embeds: [embed] }).catch(err => {})
    }
    } catch(e) {
        console.log(e)
    }
}
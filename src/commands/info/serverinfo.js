const { MessageEmbed } = require("discord.js");
const lang = require("../../language.json");
const Prime = require("../../structures/PrimeSchema.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "serverinfo",
    module: "info",
    description: "Посмотреть информацию о сервере",
    description_en: "View information about the server",
    description_ua: "Переглянути інформацію про сервер",
    usage: "serverinfo",
    example: "/serverinfo",
    example_en: "/serverinfo",
    example_ua: "/serverinfo",
  async run(client,message,args,langs) {

    let dat = await Prime.findOne({
        guildID: message.guild.id,
        status: "Активна"
    });

    try {

        let owner = undefined;

        let ownerid = await client.users.fetch(message.guild.ownerId).then(user => owner = user.id)
        if (typeof ownerid !== "string") {
            ownerid = require("util").inspect(ownerid, { depth: 0 });
        }

        let ownertag = await client.users.fetch(message.guild.ownerId).then(user => owner = user.tag)
        if (typeof ownerid !== "string") {
            ownertag = require("util").inspect(ownerid, { depth: 0 });
        }

        if(message.guild.verificationLevel === "NONE") {
            verificationLevel = `${lang.verif_level_none[langs]}`
        }else if(message.guild.verificationLevel === "LOW") {
            verificationLevel = `${lang.verif_level_low[langs]}`
        }else if(message.guild.verificationLevel === "MEDIUM") {
            verificationLevel = `${lang.verif_level_medium[langs]}`
        }else if(message.guild.verificationLevel === "HIGH") {
            verificationLevel = `${lang.verif_level_high[langs]}`
        }else if(message.guild.verificationLevel === "VERY_HIGH") {
            verificationLevel = `${lang.verif_level_very_high[langs]}`
        }

        await message.member.guild.members.fetch();
        let users = message.guild.memberCount - message.member.guild.members.cache.filter(m => m.user.bot).size
        let createdDate = message.guild.createdAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false })

        let infoEmbed = new MessageEmbed()
        .setColor(`BLUE`)
        .setTitle(`${lang.serverinfo_title[langs]}`)
        .setDescription(`<:server:976145578503327755> ${lang.serverinfo_name[langs]} **${message.guild.name}**\`(${message.guild.id})\`\n<:pngegg:977105217856344114> ${lang.serverinfo_owner[langs]} <@${ownerid}> (\`${ownertag}\` / \`${ownerid}\`)\n<:security:977102397870575636> ${lang.serverinfo_level_verification[langs]} \`${verificationLevel}\`\n<:picture:976155591921770516> ${lang.serverinfo_avatar[langs]} [${lang.serverinfo_url[langs]}](${message.guild.iconURL()})\n<:date:976155789632876605> ${lang.serverinfo_when_create[langs]} \`${createdDate}\``)
        .addField(`${lang.serverinfo_channels[langs]}`, `<:info:976156282803351653> ${lang.serverinfo_channels_total[langs]} \`${message.guild.channels.cache.size}\`\n<:text:976156581026734090> ${lang.serverinfo_channels_text[langs]} \`${message.guild.channels.cache.filter(c => c.type == 'GUILD_TEXT').size}\`\n<:micro:976156864087728138> ${lang.serverinfo_channels_voice[langs]} \`${message.guild.channels.cache.filter(c => c.type == 'GUILD_VOICE').size}\`\n<:settings:976157059936575519> ${lang.serverinfo_channels_category[langs]} \`${message.guild.channels.cache.filter(c => c.type == 'GUILD_CATEGORY').size}\``, true)
        .addField(`${lang.serverinfo_users[langs]}`, `<:info:976156282803351653> ${lang.serverinfo_users_total[langs]} \`${message.guild.memberCount}\`\n<:users:977097893540401182> ${lang.serverinfo_users_humans[langs]} \`${users}\`\n<:bot:977104466551644180> ${lang.serverinfo_users_bots[langs]} \`${message.member.guild.members.cache.filter(m => m.user.bot).size}\``, true)
        .setThumbnail(message.guild.iconURL())
        if(!dat) infoEmbed.description += `\n\n<:psy:977087084898693131> ${lang.serverinfo_prime_none[langs]} ([${lang.serverinfo_prime_how_to_get[langs]}](https://discord.gg/BcjY2Fa3hP))`
        if(dat) {
            let when = dat.primeEnd
            const end = moment.duration(`${when - Date.now()}`).format("D [days], H [hrs], m [mins], s [secs]")
            infoEmbed.description += `\n\n<:psy:977087084898693131> ${lang.serverinfo_prime_time[langs]} \`${end}\``
        }
        message.reply({ embeds: [infoEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
    } catch (e) {
        console.log(e)
    }
  }
}
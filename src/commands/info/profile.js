const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const User = require("../../structures/UserSchema.js");
const Badge = require("../../structures/BadgeSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const Guild = require("../../structures/GuildSchema.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "profile",
    module: "info",
    description: "Посмотреть свой/чужой профиль",
    description_en: "View your/someone else's profile",
    description_ua: "Переглянути свій/чужий профіль",
    usage: "profile",
    example: "/profile - посмотреть свой профиль\n/profile 608684992335446064 - посмотреть профиль пользователя, указав его ид",
    example_en: "/profile - view your profile\n/profile 608684992335446064 - view the user's profile by providing its ID",
    example_ua: "/profile - переглянути свій профіль\n/profile 608684992335446064 переглянути профіль користувача, вказав його ID",
  async run(client,message,args,langs) {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => {}) || message.member

    let guild = await Guild.findOne({
        guildID: message.guild.id
    });

    if(!guild) return;

    let data = await User.findOne({
        guildID: message.guild.id,
        userID: member.id
    });

    let res = await Badge.findOne({
        userID: member.id
    });

    let dataPRIME = await Prime.findOne({
        userID: member.id,
        status: "Активна"
    });

    try {

        if(!data) {
            let errorMess = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.data_undefined[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(data.promo === "не использовал") {
            promo = `${lang.promocode_no[langs]}`
        }else{
            promo = data.promo
        }

        let name = member.user?.tag ?? member.tag
        let ava = member.user?.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) ?? member.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
          
        let profile = new MessageEmbed()
        .setColor(`#FF0000`)
        .setTitle(`${lang.profile_user[langs]} \`${name}\``)
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
        .setDescription(`**[💰] ${lang.coins[langs]}** \`${data.money || 0}\`\n**[💶] ${lang.rubles[langs]}** \`${data.rubles}\`\n**[⚙️] ${lang.trud_job[langs]}** \`${data.Job_skill}\`\n**[📧] ${lang.messages[langs]}** \`${data.messages || 0}\`\n**[✏️] ${lang.promocoded[langs]}** \`${promo}\`\n**[📌] ${lang.warns[langs]}** \`${data.warn}/${guild.warns}\``)
        .setThumbnail(ava)
        .setTimestamp()
        .setFooter({ text: `${lang.requested_by[langs]} ${message.author.username}`, iconURL: message.member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
        if(res) profile.description += `\n**[🏆] ${lang.badges[langs]}** ${res.badges}`
        if(dataPRIME) {
            let when = dataPRIME.primeEnd
            const end = moment.duration(`${when - Date.now()}`).format("D [days], H [hrs], m [mins], s [secs]")
            profile.description += `\n**[<:boost:971617326669631538>] ${lang.prime_stat[langs]}** \`${end}\``
        }
        message.reply({ embeds: [profile], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      } catch (e) {
          console.log(e)          
      }
    }
}
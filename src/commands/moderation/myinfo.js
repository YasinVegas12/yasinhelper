const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "myinfo",
    module: "moderation",
    description: "Посмотреть свою/чужую статистику модератора",
    description_en: "View your / someone else's moderator statistics",
    description_ua: "Переглянути свою/чужу статистику модератора",
    usage: "myinfo",
    example: "/myinfo",
    example_en: "/myinfo",
    example_ua: "/myinfo",
    cooldown: 15,
  async run(client,message,args,langs,prefix,ownerTAG) {

    try {

        const developer = [
            config.developer,
        ];

        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        if (cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

        let data = await User.findOne({
            guildID: message.guild.id,
            userID: member.id
        });

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.myinfo_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has(["MANAGE_MESSAGES"])) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (!data) {
            let errorMess = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`${lang.myinfo_nodb[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        function average([ one_rep, two_rep, three_rep, four_rep, five_rep ]) {
            const obj = { one_rep: 1, two_rep: 2, three_rep: 3, four_rep: 4, five_rep: 5 };
            const arr = [];
            Object.keys(obj).forEach((i) => {
                Array.from({ length: arguments[0][obj[i]-1] }, () => arr.push(obj[i]));
            });
            if (!arr.length) return '0';
            return (arr.reduce((a, b) => (a + b)) / arr.length).toFixed(2);
        }

        let one = data.one_rep 
        let two = data.two_rep 
        let three = data.three_rep 
        let four = data.four_rep 
        let five = data.five_rep 

        let embed = new MessageEmbed()
        .setColor(`#FF0000`)
        .setTitle(`${lang.myinfo_profile[langs]} \`${member.user.tag}\``)
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
        .setDescription(`**[🤖] ${lang.myinfo_tickets[langs]} **\`${data.holdticket}\`\n**[1️⃣] ${lang.myinfo_one_balls[langs]} **\`${data.one_rep}\`\n**[2️⃣] ${lang.myinfo_one_balls[langs]} **\`${data.two_rep}\`\n**[3️⃣] ${lang.myinfo_one_balls[langs]} **\`${data.three_rep}\`\n**[4️⃣] ${lang.myinfo_one_balls[langs]}** \`${data.four_rep}\`\n**[5️⃣] ${lang.myinfo_one_balls[langs]}** \`${data.five_rep}\`\n**[📊] ${lang.average[langs]}** \`${average([one,two,three,four,five])}\`\n**[⚡] ${lang.myinfo_kick[langs]}** \`${data.givekick}\`\n**[🅱] ${lang.myinfo_ban[langs]} **\`${data.giveban}\`\n**[🔇] ${lang.myinfo_mute[langs]}** \`${data.givemute}\`\n**[🛡️] ${lang.myinfo_warn[langs]}** \`${data.givewarn}\``)
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setTimestamp()
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (!dataPRIME) {
            if(!developer.some(dev => dev == message.author.id)) {
                cooldown.add(message.author.id);
            }

            setTimeout(() =>{
                cooldown.delete(message.author.id)
            }, cdseconds * 1000)
        }
        } catch (e) {
            console.log(e)
        }
    }
}
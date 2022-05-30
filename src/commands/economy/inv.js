const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "inv",
    module: "economy",
    description: "Посмотреть свой инвентарь ролей",
    description_en: "View your inventory of roles",
    description_ua: "Переглянути свій інвентар ролей",
    usage: "inv",
    example: "/inv",
    example_en: "/inv",
    example_ua: "/inv",
  async run(client,message,args,langs,prefix) {

    try {

        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });
    
        if(!data) return;
    
        if(data.inventory === undefined || data.inventory === null || data.inventory.length === 0) {
            let invNull = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.inv_clear[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [invNull], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        let irole = data.inventory
        let roles = irole.split(";").map(a => `<@&${a}> [${a}] `).join("\n")
    
        let invEmbed = new MessageEmbed()
        .setColor(`BLUE`)
        .setTitle(`${lang.inv_title[langs]} \`${message.member.displayName}\``)
        .setDescription(`${lang.inv_info_description[langs]}\n${lang.inv_put_description[langs]} \`${prefix}inv-put\`\n${lang.inv_take_description[langs]} \`${prefix}inv-take\``)
        .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .addField(`${lang.inv_roles_list[langs]}`, roles)
        .setTimestamp()
        message.reply({ embeds: [invEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } catch (e) {
            console.log(e)
        }
    }
}
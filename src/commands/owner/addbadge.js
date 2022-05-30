const { MessageEmbed } = require("discord.js");
const Badge = require("../../structures/BadgeSchema.js");

module.exports = {
    name: "addbadge",
    aliases: ["ab"],
    module: "owner",
  async run(client,message,args,langs,prefix) {

      try {

        let badge_user = args[0]

        let errorID = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, Укажите ID пользователя`)
        .setTimestamp()
        if(!badge_user) return message.reply({ embeds: [errorID], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
        let bd_badge = await Badge.findOne({
            userID: badge_user
        })
    
        if(!bd_badge) {
            let addDB = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`Успешно`)
            .setDescription(`\`${message.author.username}\`, пользователь \`${badge_user}\` успешно добавлен в базу данных значков!`)
            .setTimestamp()
            message.reply({ embeds: [addDB], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
            await new Badge({
                userID: badge_user,
                badges: "не указано"
            }).save()
    }else{
        let alreadyDB = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, пользователь \`${badge_user}\` уже есть в базе данных!`)
        .setTimestamp()
        return message.reply({ embeds: [alreadyDB], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }
      } catch (e) {
          console.log(e)
      }
  }
}
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "message",
    aliases: ["m"],
    module: "owner",
  async run(client,message,args) {

      try {
          
        let messageMember = await client.users.fetch(args[0]).catch(() => {})

        let noUser = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, пользователь не найден`)
        .setTimestamp()
        if (!messageMember) return message.reply({ embeds: [noUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let text = args.slice(1).join(" ");

        let noText = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, укажите текст соообщения`)
        .setTimestamp()
        if(!text) return message.reply({ embeds: [noText], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        messageMember.send({ content: text }).then(() => { message.react("✅") }).catch(err => {
            if (err.message == `Cannot send messages to this user`) {
                return message.react(`❌`)
            }
        })
      } catch (e) {
          console.log(e)
      }
    }
}
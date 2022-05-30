const { MessageEmbed } = require("discord.js");
const lang = require("../../language.json");

module.exports = {
    name: "avatar",
    module: "user",
    description: "Показывает аватар указанного пользователя.",
    description_en: "Display specified user avatar.",
    description_ua: "Показує аватар вказаного користувача",
    usage: "avatar [User/ID]",
    example: "/avatar - посмотреть свою аватарку\n/avatar @Jason Kings#9417 - Упомянуть пользователя и посмотреть его аватарку\n/avatar 608684992335446064 - Посмотреть аватарку пользователя с помощью его ид",
    example_en: "/avatar - view your avatar\n/avatar @Jason Kings#9417 - Mention user and view his avatar\n/avatar 608684992335446064 - View user avatar on his id",
    example_ua: "/avatar - переглянути свій аватар\n/avatar 608684992335446064 - Переглянути аватар користувача по ID",
  async run(client,message,args,langs) {

    try {

        var user;

        user = message.mentions.users.first();

        if (!user) {
            if (!args[0]) {
                user = message.author;
                getuseravatar(user);
            } else {
                var id = args[0]
                await client.users.fetch(id).then(user => {
                    getuseravatar(user)}).catch(err => {
                        let errorEmbed = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.user_no_found[langs]}`)
                        .setTimestamp()
                        return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    });
                }
            } else {
                getuseravatar(user);
            }
            
            function getuseravatar(user) {
                let embed = new MessageEmbed()
                .setColor("#3eeb05")
                .setDescription(`${lang.avatar_description[langs]}: **${user.tag}**\n\n**[PNG](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})** **/** **[JPG](${user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 4096 })})** **/** **[WEBP](${user.displayAvatarURL({ format: 'webp', dynamic: true, size: 4096 })})**`)
                .setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
                .setFooter({ text: `${lang.requested_by[langs]} ${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
                .setTimestamp()
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        } catch(e) {
            console.log(e)
        }
    }
}
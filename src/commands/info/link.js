const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const lang = require("../../language.json");

module.exports = {
    name: "link",
    module: "info",
    description: "Получить ссылку на инвайт бота/дискорд сервер/телеграм канал",
    description_en: "Get a link to the invite bot/discord server/telegram channel",
    description_ua: "Отримати посилання на додавання бота/діскорд сервер/телеграм канал",
    usage: "link",
    example: "/link",
    example_en: "/link",
    example_ua: "/link",
  async run(client,message,args,langs) {
        try {

        let embed = new MessageEmbed()
        .setColor("#483D8B")
        .setTitle(`${lang.link_title[langs]}`)
        .addField(`${lang.link_field_one[langs]}`, `**[${lang.discord_invite[langs]}](https://discord.com/api/oauth2/authorize?client_id=974235906275954738&permissions=8&scope=bot)**\n**[${lang.link_server_invite[langs]}](https://discord.gg/pcjm28pGsa)**`)
        .setThumbnail(client.user.avatarURL())

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=974235906275954738&permissions=8&scope=bot`)
                    .setLabel(`${lang.discord_invite[langs]}`)
                    .setStyle('LINK'),
        );

        message.reply({ embeds: [embed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } catch(e) {
            console.log(e)
        }
    }
}

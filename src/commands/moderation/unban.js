const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "unban",
    module: "moderation",
    description: "Разбанить пользователя на сервере",
    description_en: "Unban a user on the server",
    description_ua: "Розблокувати користувача на сервері",
    usage: "unban [user ID]",
    example: "/unban 608684992335446064 - разбанить пользователя на сервере",
    example_en: "/unban 608684992335446064 - unban a user on the server",
    example_ua: "/unban 608684992335446064 - розблокувати користувача на сервері",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        if(!message.guild.me.permissions.has(`BAN_MEMBERS`)) {
            let noPermission = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.unban_bot_permissions[langs]} \`BAN_MEMBERS\``)
            .setTimestamp()
            return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ban_user_permission[langs]}`)
        .setTimestamp()
        if(!developer.some(dev => dev == message.author.id) && !message.member.permissions.has(["BAN_MEMBERS"])) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let id = message.mentions.users.first() ? message.mentions.users.first().id : args[0]

        if(!id) {
            let unId = new MessageEmbed()
            .setColor(`#e81515`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.unban_how[langs]} \`${prefix}unban [ID]\``)
            .setTimestamp()
            return message.reply({ embeds: [unId], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('acceptButton')
                    .setStyle('SUCCESS')
                    .setEmoji('✅'),
                new MessageButton()
                    .setCustomId('denyButton')
                    .setStyle('DANGER')
                    .setEmoji('❌')
            )

        let member = await client.users.fetch(id).catch(() => {})

        let embed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.cmd_ban_accept[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.unban_accept_text[langs]} \`${member.tag}\``)
        .setTimestamp()

        const msg = await message.reply({ embeds: [embed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterAcceptButton = i => i.customId === 'acceptButton' && i.user.id === `${message.author.id}`;
        const filterExitButton = i => i.customId === 'denyButton' && i.user.id === `${message.author.id}`;

        const collectorAccept = message.channel.createMessageComponentCollector({ filterAcceptButton, time: 60000  });
        const collectorExit = message.channel.createMessageComponentCollector({ filterExitButton, time: 60000  });

        collectorAccept.on('collect', async i => {
            if (i.customId === 'acceptButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                message.guild.bans.fetch(id).then(async({user}) => {
                    message.guild.members.unban(id)
                    let unbanEmbed = new MessageEmbed()
                    .setColor(`#15b7e8`)
                    .setTitle("**Unban | Yasin Helper**")
                    .setColor('#FF0000')
                    .addField(`${lang.unban_embed_info[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n **${lang.unban_embed_who[langs]}** \`${user.tag}\`\n **${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n **${lang.info_id_user[langs]}** \`${user.id}\``)
                    .setFooter({ text: `${lang.reports_footer[langs]}` });
                    await i.update({ embeds: [unbanEmbed], components: [] }).catch(() => { })
                }).catch(async err => {
                    if(err.message == `Unknown Ban`) {
                        let noBan = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.unban_no[langs]}`)
                        .setTimestamp()
                        await i.update({ embeds: [noBan], components: [] }).catch(() => { })
                    }
                    let warningError = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.unban_error[langs]}`)
                    .setTimestamp()
                    await i.update({ embeds: [warningError], components: [] }).catch(() => { })
                });
            }
        });

        collectorExit.on('collect', async i => {
            if (i.customId === 'denyButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let denyUnban = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.unban_deny[langs]} \`${member.tag}\``)
                .setTimestamp()
                await i.update({ embeds: [denyUnban], components: [] }).catch(() => { })
            }
        });
        } catch (e) {
            console.log(e)
        }
    }
}
const { MessageEmbed, WebhookClient, MessageActionRow, MessageButton } = require("discord.js");
const Bans = require("../../structures/BotBlackListSchema.js");
const Bugs = require("../../structures/BugSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 300;

module.exports = {
    name: "bug",
    description: "Отправить баг создалетелю.",
    description_en: "Send a bug to owner's.",
    description_ua: "Відправити баг розробнику",
    usage: "bug [text]",
    example: "/bug Не работает команда `/avatar` - Начать процесс отправки бага на сервер технической поддержки",
    example_en: "/bug Don't work command avatar - Start the process of submitting a bug to the technical support server",
    example_ua: "/bug Не працює команда `/avatar`",
    cooldown: 300,
  async run(client,message,args,langs,prefix,ownerTAG) {

    const webhookClient = new WebhookClient({ id: '974247703586426950', token: 'YzlMlRYUtKUjEXwIf5ASecS-4-HX0l78YUcp8gwa4uRbgUikGZEj6CkyFcBcX17yZmKv' });

    let dataBAN = await Bans.findOne({
        userID: message.author.id,
        banBUG: "true"
    });

    let bugs = await Bugs.findOne({
        bugnumber: 0
    });

    if (!bugs) {
        await new Bugs({
            bugnumber: 0,
            bugnumberall: 0
        }).save()
    }
          
    if (cooldown.has(message.author.id)) {
        let cdEmbed = new MessageEmbed()
        .setColor(`#0099ff`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.bug_cd[langs]}`)
        .setTimestamp()
        return message.reply({ embeds: [cdEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }

    try {

        if (dataBAN) {
            let blockBugEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.blacklist_bug_title[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.blacklist_bug_description[langs]} \`${dataBAN.reason}\`\n\n${lang.blacklist_two_description[langs]} \`${ownerTAG}\``)
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
            return message.reply({ embeds: [blockBugEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (!message.guild.me.permissions.has(["CREATE_INSTANT_INVITE"])) {
            let warningBotPermission = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.bug_permission[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        const bugText = args.slice(0).join(" ");

        if(!bugText) {
            let errorLength = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.bug_description[langs]}\`${prefix}bug [text]\``)
            .setTimestamp()
            .setFooter({ text: `${lang.activate_footer[langs]}`, iconURL: `${client.user.avatarURL()}` })
            return message.reply({ embeds: [errorLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(bugText.length > 700) {
            let bigLength = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.bug_text_error[langs]}`)
            .setTimestamp()
            .setFooter({ text: `${lang.reports_footer[langs]}`, iconURL: `${client.user.avatarURL()}` })
            return message.reply({ embeds: [bigLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        const developer = [
            config.developer,
        ];

        let dgv = await Bugs.findOne({
            bugnumber: 0
        })

        dgv.bugnumberall++
        dgv.save()

        var nST = dgv.bugnumberall

        if(!developer.some(dev => dev == message.author.id)) {
            cooldown.add(message.author.id);
        }

        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, cdseconds * 1000)

        const bugEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${lang.bug_embed_title[langs]}`)
        .setDescription(`**${lang.bug_embed_description[langs]}**`)
        .addField(`${lang.bug_text[langs]}`, `\`${bugText}\``)
        .addField(`**${lang.attention[langs]}**`, `**${lang.text_send[langs]}**`)
        .setTimestamp()
        .setFooter({ text: `${lang.activate_footer[langs]}`, iconURL: `${client.user.avatarURL()}` })

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('sendButton')
                    .setStyle('SUCCESS')
                    .setEmoji('✅'),
                new MessageButton()
                    .setCustomId('denyButton')
                    .setStyle('DANGER')
                    .setEmoji('❌')
            );

        const msg = await message.reply({ embeds: [bugEmbed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterSendButton = i => i.customId === 'sendButton' && i.user.id === `${message.author.id}`;
        const filterDenyButton = i => i.customId === 'denyButton' && i.user.id === `${message.author.id}`;

        const collectorSend = message.channel.createMessageComponentCollector({ filterSendButton, time: 60000  });
        const collectorDeny = message.channel.createMessageComponentCollector({ filterDenyButton, time: 60000  });

        collectorSend.on('collect', async i => {
            if (i.customId === 'sendButton' & i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {

                let embed = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.bug_send[langs]}`)
                .setFooter({ text: `${lang.activate_footer[langs]}`, iconURL: `${client.user.avatarURL()}` })
                await i.update({ embeds: [embed], components: [] }).catch(() => {})

                let invite = await message.channel.createInvite().catch(err => {});

                const bugsEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Сообщение о баге')
                .setDescription(`**Номер обращения:** \`#${nST}\``)
                .addField('Сервер', `**[${message.guild.name}](${invite})**`)
                .addField('ID Сервера', `\`${message.guild.id}\``)
                .addField('Пользователь', `\`${message.author.tag}\``)
                .addField('ID Пользователя', `\`${message.author.id}\``)
                .addField('Суть обращения', `\`${bugText}\``)
                .setTimestamp()
                .setFooter({ text: `Система модерации Discord серверов © Yasin Helper`, iconURL: `${client.user.avatarURL()}` })

                webhookClient.send({
                    username: 'Yasin Helper',
                    avatarURL: 'https://cdn.discordapp.com/avatars/696430799012102155/e104c1f11769851a1c58f949d2790af0.png?size=4096',
                    content: `<@&971617085648175124>, <@&971617086235344946>`,
                    embeds: [bugsEmbed],
                });

                collectorSend.stop()
                collectorDeny.stop()
            }
        });

        collectorSend.on('collect', async i => {
            if (i.customId === 'denyButton' & i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {

                let denyEmbed = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.bug_deny_send[langs]}`)
                .setFooter({ text: `${lang.activate_footer[langs]}`, iconURL: `${client.user.avatarURL()}` })
                await i.update({ embeds: [denyEmbed], components: [] }).catch(() => { })

                collectorSend.stop()
                collectorDeny.stop()
            }
        });
    } catch (e) {
        console.log(e)
    }
  }
}
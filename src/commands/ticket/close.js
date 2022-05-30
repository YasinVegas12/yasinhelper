const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Ticket = require("../../structures/TicketSchema.js");
const Guild = require("../../structures/GuildSchema.js");
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "close",
    module: "ticket",
    description: "Закрыть тикет.",
    description_en: "Closed ticket.",
    description_ua: "Закрити тікет.",
    usage: "close",
    example: "/close - Закрыть тикет",
    example_en: "/close - Closed ticket",
    example_ua: "/close - Закрити тікет",  
    async run(client,message,args,langs,prefix,ownerTAG,supportrole) {

    try {
        
        const developer = [
            config.developer,
        ];

        let dataTicket = await Ticket.findOne({
            guildID: message.guild.id,
            channelID: message.channel.id
        });

        let data = await User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        });

        if (!data) return;

        let dat = await Guild.findOne({
            guildID: message.guild.id
        });

        if (!dat) return;

        let warningBotPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.support_permissions[langs]}`)
        .setTimestamp()
        if (!message.guild.me.permissions.has(["ADMINISTRATOR"])) return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let moderator_role = message.guild.roles.cache.filter(r => supportrole.includes(r.id));
        let roles = moderator_role.sort((a, b) => b.position - a.position).map(role => role.toString()) 

        let warningPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ticket_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_ROLES") && !message.member.roles.cache.some(r => moderator_role.some(role => role.id == r.id))) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningNoTicket = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.use_ticket[langs]}`)
        .setTimestamp()
        if (!message.channel.name.startsWith('ticket-')) return message.reply({ embeds: [warningNoTicket], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningTicket = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ticket_nodb[langs]}`)
        .setTimestamp()
        if (!dataTicket) return message.reply({ embeds: [warningTicket], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let r_categ = dat.closeCategory
        let r_category = message.guild.channels.cache.find(c => c.name == r_categ) || message.guild.channels.cache.find(c => c.id == r_categ);

        let closeIsNotDefined = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ticket_category[langs]} \`${dat.closeCategory}\` ${lang.ticket_category_undefined[langs]}`)
        .setTimestamp()
        if(!r_category) return message.reply({ embeds: [closeIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningToClose = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.close_set_already[langs]}`)
        .setTimestamp()
        if(dataTicket.status === "Closed") return message.reply({ embeds: [warningToClose], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let activeChildren = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.children_size[langs]}`)
        .setTimestamp()
        if (r_category.children.size >= 45) return message.reply({ embeds: [activeChildren], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (roles.length === 0) {
            let undefined_moder_role = new MessageEmbed()
            .setColor(`#f00000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.supportrole_undefined[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [undefined_moder_role], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        message.channel.setParent(r_category.id).catch(err => {})
        
        let memberid = dataTicket.userID

        let chel = await message.guild.members.fetch(memberid).catch(() => {})

        const users_to_support = [{
            id: message.guild.id,
            deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`]
        }]

        moderator_role.forEach(moderator => {
            users_to_support.push({
                id: moderator.id,
                allow: [`VIEW_CHANNEL`,`READ_MESSAGE_HISTORY`],
                deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`,`USE_EXTERNAL_EMOJIS`]
            })
        })

        const users_to_support_two = [{
            id: message.guild.id,
            deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`]
        }]

        moderator_role.forEach(moderator => {
            users_to_support_two.push({
                id: moderator.id,
                allow: [`VIEW_CHANNEL`,`READ_MESSAGE_HISTORY`],
                deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`,`USE_EXTERNAL_EMOJIS`]
            })
        })

        if (chel) {
            users_to_support.push({
                id: chel.id,
                allow: [`VIEW_CHANNEL`,`READ_MESSAGE_HISTORY`], 
                deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`]
            });
            message.channel.permissionOverwrites.set(users_to_support).catch(err => {})
        } else {
            message.channel.permissionOverwrites.set(users_to_support_two).catch(err => {})
        }

        const embed = new MessageEmbed() 
        .setColor(`#f5a60a`) 
        .setTitle(`${lang.gread_title[langs]}`)
        .setDescription(`**[1️⃣] - ${lang.one_balls[langs]}**\n**[2️⃣] - ${lang.two_balls[langs]}**\n**[3️⃣] - ${lang.three_balls[langs]}**\n**[4️⃣] - ${lang.four_balls[langs]}**\n**[5️⃣] - ${lang.five_balls[langs]}**`)
        .setFooter({ text: `${lang.reports_footer[langs]}` })

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('oneButton')
                    .setStyle('DANGER')
                    .setEmoji('1️⃣'),
                new MessageButton()
                    .setCustomId('twoButton')
                    .setStyle('DANGER')
                    .setEmoji('2️⃣'),
                new MessageButton()
                    .setCustomId('threeButton')
                    .setStyle('PRIMARY')
                    .setEmoji('3️⃣'),
                new MessageButton()
                    .setCustomId('fourButton')
                    .setStyle('SUCCESS')
                    .setEmoji('4️⃣'),
                new MessageButton()
                    .setCustomId('fiveButton')
                    .setStyle('SUCCESS')
                    .setEmoji('5️⃣')
            );
        let msg = await message.reply({ content: `<@${memberid}>, \`${lang.close_message[langs]}\` <@${message.author.id}>`, embeds: [embed], ephemeral: true, components: [row], failIfNotExists: false });

        let duration = parseInt(dat.timeTicketDelete);

        dataTicket.tDelete = Date.now() + duration
        dataTicket.status = "Closed"
        dataTicket.save()

        let reportschannel = dat.reportschannel
        let channels = message.guild.channels.cache.find(c => c.name == reportschannel) || message.guild.channels.cache.find(c => c.id == reportschannel);

        if(channels) {
            let logTicket = new MessageEmbed()
            .setColor(`#03fc03`)
            .setTitle(`${lang.status_ticket_update[langs]}`)
            .setDescription(`**${lang.moderator[langs]}** \`${message.author.username}\` **${lang.moderator_status[langs]}** <#${message.channel.id}> **${lang.status_closed[langs]}**`)
            .setFooter({ text: `${lang.reports_footer[langs]}` })
            .setTimestamp()
            channels.send({ embeds: [logTicket] }).catch(err =>{})
        }

        const filterOneButton = i => i.customId === 'oneButton' && i.user.id === `${chel.id}`;
        const filterTwoButton = i => i.customId === 'twoButton' && i.user.id === `${chel.id}`;
        const filterThreeButton = i => i.customId === 'threeButton' && i.user.id === `${chel.id}`;
        const filterFourButton = i => i.customId === 'fourButton' && i.user.id === `${chel.id}`;
        const filterFiveButton = i => i.customId === 'fiveButton' && i.user.id === `${chel.id}`;

        const collectorOne = message.channel.createMessageComponentCollector({ filterOneButton, time: 43200000 });
        const collectorTwo = message.channel.createMessageComponentCollector({ filterTwoButton, time: 43200000 });
        const collectorThree = message.channel.createMessageComponentCollector({ filterThreeButton, time: 43200000 });
        const collectorFour = message.channel.createMessageComponentCollector({ filterFourButton, time: 43200000 });
        const collectorFive = message.channel.createMessageComponentCollector({ filterFiveButton, time: 43200000 });

        collectorOne.on('collect', async i => {
            if (i.customId === 'oneButton' && i.user.id === `${chel.id}` && i.message.id === `${msg.id}`) {
                let oneBallEmbed = new MessageEmbed()
                .setColor(`BLUE`)
                .setTitle(`${lang.marks_title[langs]}`)
                .setDescription(`<@${memberid}>, ${lang.one_ball[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [oneBallEmbed], components: [] }).catch(() => {})
                data.one_rep += 1
                data.save()
                collectorOne.stop()
                collectorTwo.stop()
                collectorThree.stop()
                collectorFour.stop()
                collectorFive.stop()
            }
        });

        collectorTwo.on('collect', async i => {
            if (i.customId === 'twoButton' && i.user.id === `${chel.id}` && i.message.id === `${msg.id}`) {
                let twoBallEmbed = new MessageEmbed()
                .setColor(`BLUE`)
                .setTitle(`${lang.marks_title[langs]}`)
                .setDescription(`<@${memberid}>, ${lang.two_ball[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [twoBallEmbed], components: [] }).catch(() => {})
                data.two_rep += 1
                data.save()
                collectorOne.stop()
                collectorTwo.stop()
                collectorThree.stop()
                collectorFour.stop()
                collectorFive.stop()
            }
        });

        collectorThree.on('collect', async i => {
            if (i.customId === 'threeButton' && i.user.id === `${chel.id}` && i.message.id === `${msg.id}`) {
                let threeBallEmbed = new MessageEmbed()
                .setColor(`BLUE`)
                .setTitle(`${lang.marks_title[langs]}`)
                .setDescription(`<@${memberid}>, ${lang.three_ball[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [threeBallEmbed], components: [] }).catch(() => {})
                data.three_rep += 1
                data.save()
                collectorOne.stop()
                collectorTwo.stop()
                collectorThree.stop()
                collectorFour.stop()
                collectorFive.stop()
            }
        });

        collectorFour.on('collect', async i => {
            if (i.customId === 'fourButton' && i.user.id === `${chel.id}` && i.message.id === `${msg.id}`) {
                let fourBallEmbed = new MessageEmbed()
                .setColor(`BLUE`)
                .setTitle(`${lang.marks_title[langs]}`)
                .setDescription(`<@${memberid}>, ${lang.four_ball[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [fourBallEmbed], components: [] }).catch(() => {})
                data.four_rep += 1
                data.save()
                collectorOne.stop()
                collectorTwo.stop()
                collectorThree.stop()
                collectorFour.stop()
                collectorFive.stop()
            }
        });

        collectorFive.on('collect', async i => {
            if (i.customId === 'fiveButton' && i.user.id === `${chel.id}` && i.message.id === `${msg.id}`) {
                let fiveBallEmbed = new MessageEmbed()
                .setColor(`BLUE`)
                .setTitle(`${lang.marks_title[langs]}`)
                .setDescription(`<@${memberid}>, ${lang.five_ball[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [fiveBallEmbed], components: [] }).catch(() => {})
                data.five_rep += 1
                data.save()
                collectorOne.stop()
                collectorTwo.stop()
                collectorThree.stop()
                collectorFour.stop()
                collectorFive.stop()
            }
        });
    } catch (e) {
        console.log(e)
    }
  }
}

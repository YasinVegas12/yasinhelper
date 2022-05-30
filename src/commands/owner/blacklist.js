const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Bans = require("../../structures/BotBlackListSchema.js");

module.exports = {
    name: "blacklist",
    aliases: ["bl"],
    module: "owner",
  async run(client,message,args,langs,prefix) {

    try {
        
        let warningUser = new MessageEmbed()
        .setColor('RED')
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, Необходимо указать пользователя! Правильное использование: \`${prefix}blacklist [ID пользователя] [check/add/remove] [причина(необязательно)]\``)
        .setTimestamp()    
        if (!args[0]) return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
        let howToUse = new MessageEmbed()
        .setColor('RED')
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, Необходимо указать параметр! Правильное использование: \`${prefix}blacklist [ID пользователя] [check/add/remove]\``)
        .setTimestamp()
        if (args[1] !== 'check' && args[1] !== 'add' && args[1] !== `remove`) return message.reply({ embeds: [howToUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let name = await client.users.fetch(args[0]).catch(() => {});

        let noName = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, пользователь не найден`)
        .setTimestamp()
        if(!name) return message.reply({ embeds: [noName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let data = await Bans.findOne({
            userID: name.id
        });

        if (args[1] === "check") {

            let embed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`Информация о ЧСе`)
            .setFooter({ text: `${message.member.user.tag}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            if (!data) embed.setDescription(`Пользователя нету в базе данных ЧСников!\n\`\`\`${name.tag}\`\`\``)
            if (data) embed.setDescription(`<:31781:977093976102432778> ЧС бота: ${data.fullBAN === true ? "<:command_on:875499906910019675>": "<:command_off:875500585800060978>"}\n<:31781:977093976102432778> ЧС баг трекера: ${data.banBUG === true ? "<:command_on:875499906910019675>": "<:command_off:875500585800060978>"}\n<a:note:976150101397491732> Причина: **${data.reason}**\n\`\`\`${name.tag}\`\`\``)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } else if (args[1] === "add") {

            let reason = args.slice(2).join(" ");
            if (!reason) reason = "Reason not provided"

            let embedAdd = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`Подтверждение действия`)
            .setDescription(`Какой тип ЧСа необходимо выдать?\n\`\`\`${name.tag}\`\`\``)
            .setFooter({ text: `${message.member.user.tag}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('bugTracker')
                    .setStyle('PRIMARY')
                    .setLabel(`Bug Tracker`),
                new MessageButton()
                    .setCustomId('fullBlackList')
                    .setStyle('DANGER')
                    .setLabel(`Full Ban`)
            );

            const msg = await message.reply({ embeds: [embedAdd], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const filterBugTracker = i => i.customId === 'bugTracker' && i.user.id === `${message.author.id}`;
            const filterFullBan = i => i.customId === 'fullBlackList' && i.user.id === `${message.author.id}`;

            const collectorBugTracker = message.channel.createMessageComponentCollector({ filterBugTracker, time: 60000  });
            const collectorFullBan = message.channel.createMessageComponentCollector({ filterFullBan, time: 60000  });

            collectorBugTracker.on('collect', async i => {
                if (i.customId === 'bugTracker' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    let alreadyBugAdd = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`Ошибка`)
                    .setDescription(`\`${message.author.username}\`, Данный пользователь уже имеет блокировку баг трекера!`)
                    .setTimestamp()
                    if(data && data.banBUG === true) return await i.update({ embeds: [alreadyBugAdd], components: [] }).catch(() => {})

                    let blackListTrackerAdd = new MessageEmbed()
                    .setColor(`#33353C`)
                    .setTitle(`Занесение в ЧС`)
                    .setDescription(`<:uuuuuuuusssssssssssssseeeeeeeeer:977088592524496966> Вы успешно добавили пользователя в ЧС баг трекера!\n<:31781:977093976102432778> Пользователь: **${name.tag}**\n<:plus:976154310171828245> Выдал: **${message.member.user.tag}**\n<a:note:976150101397491732> Причина: **${reason}**`)
                    .setTimestamp()

                    if (!data) {
                        await new Bans({
                            userID: name.id,
                            banBUG: true,
                            fullBAN: false,
                            reason
                        }).save()
                    } else {
                        data.banBUG = true
                        data.reason = reason
                        data.save()
                    }

                    let embedUser = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`Command banned`)
                    .setDescription(`You have been banned access to command bug in Yasin Helper\nReason: \`${reason}\`\nIf you do not agree with this punishment, you can go to the support of the server: **https://discord.gg/pcjm28pGsa**`)
                    .setThumbnail(client.user.avatarURL())
                    .setFooter({ text: `Discord Server Moderation System © Yasin Helper`, iconURL: `${client.user.avatarURL()}` })
                    .setTimestamp()
                    name.send({ embeds: [embedUser] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})

                    await i.update({ embeds: [blackListTrackerAdd], components: [] }).catch(() => {})
                }
            });

            collectorFullBan.on('collect', async i => {
                if (i.customId === 'fullBlackList' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    let alreadyBlackListAdd = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`Ошибка`)
                    .setDescription(`\`${message.author.username}\`, Данный пользователь уже находится в ЧС бота!`)
                    .setTimestamp()
                    if(data && data.fullBAN === true) return await i.update({ embeds: [alreadyBlackListAdd], components: [] }).catch(() => {})

                    let blackListAdd = new MessageEmbed()
                    .setColor(`#33353C`)
                    .setTitle(`Занесение в ЧС`)
                    .setDescription(`<:uuuuuuuusssssssssssssseeeeeeeeer:977088592524496966> Вы успешно добавили пользователя в ЧС бота!\n<:31781:977093976102432778> Пользователь: **${name.tag}**\n<:plus:976154310171828245> Выдал: **${message.member.user.tag}**\n<a:note:976150101397491732> Причина: **${reason}**`)
                    .setTimestamp()

                    if (!data) {
                        await new Bans({
                            userID: name.id,
                            banBUG: true,
                            fullBAN: true,
                            reason
                        }).save()
                    } else {
                        data.banBUG = true
                        data.fullBAN = true
                        data.reason = reason
                        data.save()
                    }

                    let embedUser = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`You have been added to blacklist`)
                    .setDescription(`You have been added to the blacklist in Yasin Helper\nReason: \`${reason}\`\nIf you do not agree with this punishment, you can go to the support of the server: **https://discord.gg/pcjm28pGsa**`)
                    .setThumbnail(client.user.avatarURL())
                    .setFooter({ text: `Discord Server Moderation System © Yasin Helper`, iconURL: `${client.user.avatarURL()}` })
                    .setTimestamp()
                    name.send({ embeds: [embedUser] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})

                    await i.update({ embeds: [blackListAdd], components: [] }).catch(() => {})
                }
            });
        } else if (args[1] === "remove") {

            let reason = args.slice(2).join(" ");
            if (!reason) reason = "Reason not provided"

            let embedRemove = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`Подтверждение действия`)
            .setDescription(`Какой тип ЧСа необходимо снять?\n\`\`\`${name.tag}\`\`\``)
            .setFooter({ text: `${message.member.user.tag}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('bugTrackerRemove')
                    .setStyle('PRIMARY')
                    .setLabel(`Bug Tracker`),
                new MessageButton()
                    .setCustomId('fullBlackListRemove')
                    .setStyle('DANGER')
                    .setLabel(`Full Ban`)
            );

            const msg = await message.reply({ embeds: [embedRemove], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const filterBugTracker = i => i.customId === 'bugTrackerRemove' && i.user.id === `${message.author.id}`;
            const filterFullBan = i => i.customId === 'fullBlackListRemove' && i.user.id === `${message.author.id}`;

            const collectorBugTrackerRemove = message.channel.createMessageComponentCollector({ filterBugTracker, time: 60000  });
            const collectorFullBanRemove = message.channel.createMessageComponentCollector({ filterFullBan, time: 60000  });

            collectorBugTrackerRemove.on('collect', async i => {
                if (i.customId === 'bugTrackerRemove' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    let alreadyBugRemove = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`Ошибка`)
                    .setDescription(`\`${message.author.username}\`, Данный пользователь не имеет блокировку баг трекера!`)
                    .setTimestamp()
                    if(!data || data.banBUG === false) return await i.update({ embeds: [alreadyBugRemove], components: [] }).catch(() => {})

                    let blackListTrackerRemove = new MessageEmbed()
                    .setColor(`#33353C`)
                    .setTitle(`Удаление с ЧС`)
                    .setDescription(`<:uuuuuuuusssssssssssssseeeeeeeeer:977088592524496966> Вы успешно сняли пользователю ЧС баг трекера!\n<:unbanned:876499813531803708> Пользователь: **${name.tag}**\n<:plus:976154310171828245> Снял: **${message.member.user.tag}**\n<a:note:976150101397491732> Причина: **${reason}**`)
                    .setTimestamp()

                    data.banBUG = false
                    data.reason = reason
                    data.save()

                    let embedUser = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`You have been unlocked access to the bug command`)
                    .setDescription(`Congratulations! You have been unlocked access to the bug command in Yasin Helper`)
                    .setThumbnail(client.user.avatarURL())
                    .setFooter({ text: `Discord Server Moderation System © Yasin Helper`, iconURL: `${client.user.avatarURL()}` })
                    .setTimestamp()
                    name.send({ embeds: [embedUser] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})

                    await i.update({ embeds: [blackListTrackerRemove], components: [] }).catch(() => {})
                }
            });

            collectorFullBanRemove.on('collect', async i => {
                if (i.customId === 'fullBlackListRemove' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    let alreadyBlackListRemove = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`Ошибка`)
                    .setDescription(`\`${message.author.username}\`, Данный пользователь не находится в ЧС бота!`)
                    .setTimestamp()
                    if(!data || data.fullBAN === false) return await i.update({ embeds: [alreadyBlackListRemove], components: [] }).catch(() => {})

                    let blackListRemove = new MessageEmbed()
                    .setColor(`#33353C`)
                    .setTitle(`Удаление с ЧС`)
                    .setDescription(`<:uuuuuuuusssssssssssssseeeeeeeeer:977088592524496966> Вы успешно сняли пользователю ЧС бота!\n<:unbanned:876499813531803708> Пользователь: **${name.tag}**\n<:plus:976154310171828245> Снял: **${message.member.user.tag}**\n<a:note:976150101397491732> Причина: **${reason}**`)
                    .setTimestamp()

                    let embedUser = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`You have been removed of blacklist`)
                    .setDescription(`Congratulations! You have been removed of blacklist Yasin Helper`)
                    .setThumbnail(client.user.avatarURL())
                    .setFooter({ text: `Discord Server Moderation System © Yasin Helper`, iconURL: `${client.user.avatarURL()}` })
                    .setTimestamp()
                    name.send({ embeds: [embedUser] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})

                    data.banBUG = false
                    data.fullBAN = false
                    data.reason = reason
                    data.save()

                    await i.update({ embeds: [blackListRemove], components: [] }).catch(() => {})
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
  }
}
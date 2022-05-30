const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "kn",
    module: "fun",
    description: "Игра крестики-нолики",
    description_en: "Tic-tac-toe game",
    description_ua: "Гра крестики-нолики",
    usage: "kn [user]",
    example: "/kn 608684992335446064 - Отправить приглашение в игру",
    example_en: "/kn 608684992335446064 - Send an invite to the game",
    example_ua: "/kn 608684992335446064 - Відправити запрошення зіграти у гру користувачу",
  async run(client,message,args,langs,prefix) {

    try {

        let data = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if (!data) return;

        let warningBotPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.support_permissions[langs]}`)
        .setTimestamp()
        if (!message.guild.me.permissions.has(["ADMINISTRATOR"])) return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let primeCommand = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.prime_server_command[langs]}`)
        .setTimestamp()
        if (data.prime === false) return message.reply({ embeds: [primeCommand], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const krestik = "❌";
        const nolik = "⭕";
        const otv = `\u200b`;
        const fuser = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        let noUser = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kn_user[langs]} \`${prefix}kn [id/@user]\``)
        .setTimestamp()
        if (fuser == undefined) return message.reply({ embeds: [noUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningYou = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kn_already_you[langs]}`)
        .setTimestamp()
        if(fuser.id === message.author.id) return message.reply({ embeds: [warningYou], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        {
            var players = [message.author.id, fuser.id]
            var cells = [];
            var counter;
            var random_bool;
            var order_players = {};
            const winned_combinations = [
                [0, 1, 2], [3, 4, 5],
                [6, 7, 8], [0, 3, 6],
                [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
    
            function draw_field(main_embed) {
                let embed = new MessageEmbed()
                .setTitle(`${lang.kn_title[langs]}`)
                .setColor("RED")
                .setDescription(`**${cells[0]}** | **${cells[1]}** | **${cells[2]}**\n**${cells[3]}** | **${cells[4]}** | **${cells[5]}**\n**${cells[6]}** | **${cells[7]}** | **${cells[8]}**`)
                .setThumbnail(message.guild.iconURL())
                .addField(otv, `**${lang.kn_walks[langs]} **<@${order_players[0][0]}>`)
                .setFooter({ text: "System by Yasin Helper" })
                return main_embed.edit({ embeds: [embed] }).catch(err => {})    
            }

            async function logic(main_embed, chan) {
                counter += 1;
    
                // Перебираем значения поля по выграшным комбинациям
                for (let i = 0; i < winned_combinations.length; i++) {
                    if (cells[winned_combinations[i][0]] == nolik && cells[winned_combinations[i][1]] == nolik && cells[winned_combinations[i][2]] == nolik) {
                        switch_mover()
                        draw_field(main_embed);
                        var finish_msg = await chan.send({ content: `<@${order_players[1][0]}>\`, ${lang.kn_won[langs]}\`` }).catch(err => {})
                        return command_handler(chan, main_embed, finish_msg)
                    }
                    else if (cells[winned_combinations[i][0]] == krestik && cells[winned_combinations[i][1]] == krestik && cells[winned_combinations[i][2]] == krestik) {
                        draw_field(main_embed);
                        var finish_msg = await chan.send({ content: `<@${order_players[0][0]}>\`, ${lang.kn_won[langs]}\`` }).catch(err => {})
                        return command_handler(chan, main_embed, finish_msg)
                    }
                }

                // Если значение считателя 9, то ничья
                if (counter >= 9) {
                    draw_field(main_embed);
                    var finish_msg = await chan.send({ content: `<@${order_players[0][0]}> <@${order_players[1][0]}>\` - ${lang.kn_draw[langs]}\`` }).catch(err => {})
                    return command_handler(chan, main_embed, finish_msg)
                }

                switch_mover();
                draw_field(main_embed);
                return move_handler(main_embed, chan);
            }

            // Меняем игрокам индексы
            function switch_mover() {
                return [order_players[0][0], order_players[0][1], order_players[1][0], order_players[1][1]] = [order_players[1][0], order_players[1][1], order_players[0][0], order_players[0][1]]
            }

            async function move_handler(main_embed, chan) {
                let mover_id = order_players[0][0]
                const filter = m => m.author.id === `${mover_id}`

                await chan.awaitMessages({ filter,
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async answer => {
                    answer.first().delete().catch(err => {})
                    let move_value = parseInt(answer.first().content)
    
                    // Если пользователь ввел не целое число либо ввел значения больше 9 либо меньше 1
                    if (move_value == 'undefined' || isNaN(move_value) || (move_value < 1 || move_value > 9)) {
                        let msg = await chan.send({ content: `<@${order_players[0][0]}>\`, ${lang.kn_incorrect[langs]}\`` }).catch(err => {})
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 4000);
                        return move_handler(main_embed, chan);
                    }
                    // Проверяем заполнено ли поле
                    else if (cells[move_value - 1] == krestik || cells[move_value - 1] == nolik) {
                        let msgg = await chan.send({ content: `<@${order_players[0][0]}>\`, ${lang.kn_this[langs]}\`` }).catch(err => {})
                        setTimeout(() => {
                            msgg.delete().catch()
                        }, 4000);
                        return move_handler(main_embed, chan);
                    }
                    // Помещяем значения в массивы 
                    else {
                        cells[move_value - 1] = order_players[0][1];
                        logic(main_embed, chan)
                    }
    
                }).catch(async () => { // Если ошибка либо пользователь ничего не ответил
                    var loose_msg = await chan.send({ content: `<@${order_players[0][0]}>\`, ${lang.kn_time[langs]}\`` }) .catch(err => {})
                    return command_handler(chan, main_embed, loose_msg)
                });;
            }

            async function start_game(chan) {
                cells = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
                counter = 0;
                random_bool = Math.random() >= 0.5 ? [players[0], players[1]] = [players[0], players[1]] : [players[0], players[1]] = [players[1], players[0]];
                order_players = { // Присваиваем каждему игроку его знак и помещаем это всё в массив под индексом
                    0: [players[0], krestik],
                    1: [players[1], nolik]
                };
                let startEmbed = new MessageEmbed()
                .setTitle(`${lang.kn_title[langs]}`)
                .setColor("RED")
                .setDescription(`**${cells[0]}** | **${cells[1]}** | **${cells[2]}**\n**${cells[3]}** | **${cells[4]}** | **${cells[5]}**\n**${cells[6]}** | **${cells[7]}** | **${cells[8]}**`)
                .addField(otv, `**${lang.kn_walks[langs]} **<@${order_players[0][0]}>`)
                .setFooter({ text: "System by Yasin Helper" })
                var main_embed = await chan.send({ embeds: [startEmbed] }).catch(err => {})
                move_handler(main_embed, chan);
            }
            async function finish_game(main_embed, finish_msg, chan) {
                setTimeout(() => {
                    main_embed.delete().catch(err => {})
                }, 9000);
                setTimeout(() => {
                    finish_msg.delete().catch(err => {})
                }, 10000);
                chan.delete().catch(err => {})
            }
    
            function command_handler(chan, main_embed, finish_msg) {
                const filter = m => m.author.id === message.author.id
                chan.awaitMessages({ filter, max: 1, time: 600000 }).then(async collected => {
                    if (collected.first().content == `${prefix}repeat`) {
                        collected.first().delete().catch(err => {})
                        main_embed.delete().catch(err => {})
                        finish_msg.delete().catch(err => {})
                        start_game(chan)
                    }
                    else if (collected.first().content == `${refix}stop`) {
                        collected.first().delete().catch(err => {})
                        return chan.delete().catch(err => {})
                    }else{
                        command_handler(chan, main_embed, finish_msg)
                    }
                }).catch(() => finish_game(main_embed, finish_msg, chan))
            }

            let goEmbed = new MessageEmbed()
            .setColor('#f0ff19')
            .setTitle(`${lang.kn_invite[langs]}`)
            .setAuthor({ name: `${message.author.tag} (${message.author.username})`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
            .setDescription(`**${message.author} ${lang.kn_invite_you[langs]} ${fuser} ${lang.kn_game[langs]} \`${lang.kn_title[langs]}\`**`)
            .addField(`**${lang.instruction[langs]}**`, `**\`✔ - ${lang.kn_accept[langs]}\`\n\`✖️ - ${lang.kn_deny[langs]}\`**`)
            .setFooter({ text: 'System by Yasin Helper' })

            let chans = message.guild.channels.cache.find(c => c.name == `🎲│${message.author.username}`)

            let embedChan = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.kn_channel[langs]}`)
            .setTimestamp()
            if (chans) return message.reply({ embeds: [embedChan], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const row = new MessageActionRow()

            .addComponents(
				new MessageButton()
                    .setCustomId('acceptButton')
                    .setStyle('SUCCESS')
                    .setEmoji(`✅`),
                new MessageButton()
                    .setCustomId('exitButton')
                    .setStyle('DANGER')
                    .setEmoji(`❌`)
                );

            let goMsg = await message.reply({ embeds: [goEmbed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const filterAcceptButton = i => i.customId === 'acceptButton' && i.user.id === `${fuser.id}`;
            const filterExitButton = i => i.customId === 'exitButton' && i.user.id === `${fuser.id}`;

            const collectorAccept = goMsg.createMessageComponentCollector({ filterAcceptButton, time: 60000  });
            const collectorExit = goMsg.createMessageComponentCollector({ filterExitButton, time: 60000  });

            collectorAccept.on('collect', async i => {
                if (i.customId === 'acceptButton' && i.user.id === `${fuser.id}` && i.message.id === `${goMsg.id}`) {
                    goMsg.delete().catch(err => {})           
                    var permission_channel = [
                        {
                            id: message.guild.id,
                            deny: ['CREATE_INSTANT_INVITE', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']
                        },
                        {
                            id: fuser.id,
                            allow: ['READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
                            deny: ['CREATE_INSTANT_INVITE', 'MANAGE_WEBHOOKS', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MENTION_EVERYONE', 'MANAGE_MESSAGES']
                        },
                        {
                            id: message.author.id,
                            allow: ['READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
                            deny: ['CREATE_INSTANT_INVITE', 'MANAGE_WEBHOOKS', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MENTION_EVERYONE', 'MANAGE_MESSAGES']
                        },
                    ];
                    message.guild.channels.create(`🎲│${message.author.username}`, { type: 'GUILD_TEXT', permissionOverwrites: permission_channel, parent: message.channel.parent.id }).then(async chan => {
                        let msg_help = await chan.send(`**${message.author} ${fuser}\n\`${lang.kn_text_one[langs]}\n${lang.kn_text_two[langs]} ${prefix}stop\n\n${lang.kn_text_three[langs]} ${prefix}repeat\`**`)
                            setTimeout(() => {
                                msg_help.delete().catch(err => {})
                            }, 25000);
                            start_game(chan)
                        });
                    }
                });

                collectorExit.on('collect', async i => {
                    if (i.customId === 'exitButton' && i.user.id === `${fuser.id}` && i.message.id === `${goMsg.id}`) {
                        let denyEmbed = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.successfull[langs]}`)
                        .setDescription(`\`${fuser.user.tag}\`, ${lang.kn_deny_user[langs]} \`${lang.kn_title[langs]}\``)
                        .setTimestamp()
                        await i.update({ embeds: [denyEmbed], components: [] }).catch(() => {})
                    }
                });
            }
        } catch (e) {
            console.log(e)
        }
    }
}
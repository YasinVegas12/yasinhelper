const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const lang = require("../../language.json");
const Guild = require("../../structures/GuildSchema.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "help",
    description: "Посмотреть все команды бота / узнать подробную информацию о команде",
    description_en: "Help and all commands of the bot",
    description_ua: "Переглянути всі команди бота / дізнатися докладну інформацію про команду",
    usage: "help",
    example: "/help - Посмотреть информацию о всех командах\n/help 4 - Посмотреть информацию о четвертой странице настроек (Support Team)\n/help ban - Посмотреть информацию о команде `ban`",
    example_en: "/help -View information about the all commands\nhelp 1-8 - View settings information on page 4 (Support Team)\nhelp ban - View information about the `ban` command",
    example_ua: "/help - Переглянути інформацію про всі команди\n/help 4 - Переглянути інформацію про четверту сторінку команд\n/help ban - переглянути інформацію про команду `ban`",
  async run(client,message,args,langs,prefix) {

      try {

        let data = await Guild.findOne({
            guildID: message.guild.id
        });

        if(!data) return;

        if(!args[0] || !isNaN(args[0])) {
        
            let pages = [
            /*1) */    `${lang.help_category_ad[langs]} \`[ad]\`\n\n${data.commands.ad === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}ad** - ${lang.help_ad[langs]}\n${data.commands.accept === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}accept**- ${lang.help_accept[langs]}\n${data.commands.editad === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}editad** - ${lang.help_editad[langs]}\n${data.commands.deny === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}deny** - ${lang.help_deny[langs]}`,
            /*2) */    `${lang.help_category_economy[langs]} \`[economy]\`\n\n${data.commands.addshop === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}add-shop** - ${lang.help_adddshop[langs]}\n${data.commands.bonus === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}bonus** - ${lang.help_bonus[langs]}\n${data.commands.box === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}box** - ${lang.help_box[langs]}\n${data.commands.buy === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}buy** - ${lang.help_buy[langs]}\n${data.commands.coinleaders === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}coin-leaders** - ${lang.help_coinleaders[langs]}\n${data.commands.createpromocode === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}createpromocode** - ${lang.help_createpromocode[langs]}\n${data.commands.dellshop === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}dell-shop** - ${lang.help_dellshop[langs]}\n${data.commands.editshop === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}edit-shop** - ${lang.help_editshop[langs]}\n${data.commands.fullobnul === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}fullobnul** - ${lang.help_fullobnul[langs]}\n${data.commands.game === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}game** - ${lang.help_game[langs]}\n${data.commands.invput === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}inv-put** - ${lang.help_invput[langs]}\n${data.commands.invtake === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}inv-take** - ${lang.help_invtake[langs]}\n${data.commands.inv === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}inv** - ${lang.help_inv[langs]}\n${data.commands.jobs === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}jobs** - ${lang.help_jobs[langs]}\n${data.commands.mypromocode === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}mypromocode** - ${lang.help_mypromocode[langs]}\n${data.commands.deletepromocode === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}deletepromocode** - ${lang.help_deletepromocode[langs]}\n${data.commands.fish === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}fish** - ${lang.help_fish[langs]}\n${data.commands.pay === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}pay** - ${lang.help_pay[langs]}\n${data.commands.promoleaders === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}promo-leaders** - ${lang.help_promoleaders[langs]}\n${data.commands.promocode === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}promocode** - ${lang.help_promocode[langs]}\n${data.commands.setmoney === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}setmoney** - ${lang.help_setmoney[langs]}\n${data.commands.shoplist === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}shop-list** - ${lang.help_shoplist[langs]}\n${data.commands.try === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}try** - ${lang.help_try[langs]}\n${data.commands.work === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}work** - ${lang.help_work[langs]}\n${data.commands.works === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}works** - ${lang.help_works[langs]}`,
            /*3) */    `${lang.help_category_embed[langs]} \`[embed]\`\n\n${data.commands.embclear === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}embclear** - ${lang.help_embclear[langs]}\n${data.commands.embfield === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}embfield** - ${lang.help_embfield[langs]}\n${data.commands.embsend === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}embsend** - ${lang.help_embsend[langs]}\n${data.commands.embsetup === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}embsetup** - ${lang.help_embsetup[langs]}`,
            /*4) */    `${lang.help_category_fun[langs]} \`[fun]\`\n\n${data.commands.ball === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}ball** - ${lang.help_ball[langs]}\n${data.commands.kn === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}kn** - ${lang.help_kn[langs]}\n${data.commands.newgame === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}newgame** - ${lang.help_newgame[langs]}\n${data.commands.reverse === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}reverse** - ${lang.help_reverse[langs]}`,
            /*5) */    `${lang.help_category_info[langs]} \`[info]\`\n\n${data.commands.link === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}link** - ${lang.help_link[langs]}\n${data.commands.ping === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}ping** - ${lang.help_ping[langs]}\n${data.commands.prime === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}prime** - ${lang.help_prime[langs]}\n${data.commands.profile === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}profile** - ${lang.help_profile[langs]}\n${data.commands.serverinfo === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}serverinfo** - ${lang.help_serverinfo[langs]}\n<:command_on:875499906910019675> **${prefix}shards** - ${lang.help_shards[langs]}\n${data.commands.stats === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}stats** - ${lang.help_stats[langs]}\n${data.commands.vote === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}vote** - ${lang.help_vote[langs]}`,
            /*6) */    `${lang.help_category_moderation[langs]} \`[moderation]\`\n\n${data.commands.ban === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}ban** - ${lang.help_ban[langs]}\n${data.commands.chat === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}chat** - ${lang.help_chat[langs]}\n${data.commands.check === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}check** - ${lang.help_check[langs]}\n${data.commands.clear === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}clear** - ${lang.help_clear[langs]}\n${data.commands.edit === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}edit** - ${lang.help_edit[langs]}\n${data.commands.giverole === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}giverole** - ${lang.help_giverole[langs]}\n${data.commands.history === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}history** - ${lang.help_history[langs]}\n${data.commands.kick === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}kick** - ${lang.help_kick[langs]}\n${data.commands.msg === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}msg** - ${lang.help_msg[langs]}\n${data.commands.mute === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}mute** - ${lang.help_mute[langs]}\n${data.commands.myinfo === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}myinfo** - ${lang.help_myinfo[langs]}\n${data.commands.pin === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}pin** - ${lang.help_pin[langs]}\n${data.commands.removerole === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}removerole** - ${lang.help_removerole[langs]}\n${data.commands.setstat === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}setstat** - ${lang.help_setstat[langs]}\n${data.commands.unban === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}unban** - ${lang.help_unban[langs]}\n${data.commands.unmute === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}unmute** - ${lang.help_unmute[langs]}\n${data.commands.unpin === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}unpin** - ${lang.help_unpin[langs]}\n${data.commands.unwarn === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}unwarn** - ${lang.help_unwarn[langs]}\n${data.commands.warn === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}warn** - ${lang.help_warn[langs]}`,
            /*7) */    `${lang.help_category_nsfw[langs]} \`[nsfw]\`\n\n${data.commands.fourk === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}4k** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.anal === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}anal** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.ass === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}ass** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.gif === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}gif** - GIF\n${data.commands.gonewild === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}gonewild** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.hanal === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}hanal** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.hass === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}hass** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.hentai === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}hentai** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.hmidriff === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}hmidriff** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.holo === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}holo** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.pussy === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}pussy** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.solo === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}solo** - NSFW ${lang.help_nsfw[langs]}\n${data.commands.thigh === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}thigh** - NSFW ${lang.help_nsfw[langs]}`,
            /*8) */    `${lang.help_category_settings[langs]} \`[system]\`\n\n<:command_on:875499906910019675> **${prefix}command** - ${lang.help_command[langs]}\n<:command_on:875499906910019675> **${prefix}module** - ${lang.help_module[langs]}\n<:command_on:875499906910019675> **${prefix}set** - ${lang.help_set[langs]}\n<:command_on:875499906910019675> **${prefix}setlog** - ${lang.help_setlog[langs]}\n<:command_on:875499906910019675> **${prefix}settings** - ${lang.help_settings[langs]}\n<:command_on:875499906910019675> **${prefix}upload** - ${lang.help_upload[langs]}\n<:command_on:875499906910019675> **${prefix}channel** - ${lang.channel_help[langs]}\n<:command_on:875499906910019675> **${prefix}supportrole** - ${lang.supportrole_help[langs]}`,
            /*9) */    `${lang.help_category_ticket[langs]} \`[ticket]\`\n\n${data.commands.active === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}active** - ${lang.help_active[langs]}\n${data.commands.blocksupport === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}blocksupport** - ${lang.help_blocksupport[langs]}\n${data.commands.close === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}close** - ${lang.help_close[langs]}\n${data.commands.hold === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}hold** - ${lang.help_hold[langs]}\n${data.commands.removeblocksupport === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}removeblocksupport** - ${lang.help_removeblocksupport[langs]}`,
            /*10) */   `${lang.help_category_user[langs]} \`[user]\`\n\n<:command_on:875499906910019675> **${prefix}activate** - ${lang.help_activate[langs]}\n${data.commands.avatar === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}avatar** - ${lang.help_avatar[langs]}\n<:command_on:875499906910019675> **${prefix}bug** - ${lang.help_bug[langs]}\n${data.commands.user === true ? "<:command_on:875499906910019675>" : "<:command_off:875500585800060978>"} **${prefix}user** - ${lang.help_user[langs]}`
            ]
            
            if(args[0] === "2") {
                page = 2
            }else if(args[0] === "3") {
                page = 3
            }else if(args[0] === "4") {
                page = 4
            }else if(args[0] === "5") {
                page = 5
            }else if(args[0] === "6") {
                page = 6
            }else if(args[0] === "7") {
                page = 7
            }else if(args[0] === "8") {
                page = 8
            }else if(args[0] === "9") {
                page = 9
            }else if(args[0] === "10") {
                page = 10
            }else{
                page = 1
            }
        
            const embed = new MessageEmbed()
            .setColor(`#0a5ef0`)
            .setTitle(`${lang.help_title[langs]}`)
            .setFooter({ text: `${lang.requested_by[langs]} ${message.author.username} | ${lang.help_footer_pages[langs]} [${page}/${pages.length}]`, iconURL: message.member.user.displayAvatarURL({ dynamic: true}) })
            .setDescription(pages[page-1])

            const row = new MessageActionRow()
			.addComponents(
                new MessageButton()
                    .setCustomId('mainButton')
                    .setStyle('PRIMARY')
                    .setEmoji('<:round_fast_rewind:844477073887068160>'),
				new MessageButton()
                    .setCustomId('leftButton')
                    .setStyle('PRIMARY')
                    .setEmoji('<:round_arrow_back:844477073770676234>'),
                new MessageButton()
                    .setCustomId('deleteButton')
                    .setStyle('DANGER')
                    .setEmoji('<:round_delete:844477073800429578>'),
                new MessageButton()
                    .setCustomId('rightButton')
                    .setStyle('PRIMARY')
                    .setEmoji('<:round_arrow_forward:844477073800429618>'),
                new MessageButton()
                    .setCustomId('endButton')
                    .setStyle('PRIMARY')
                    .setEmoji('<:round_fast_forward:844477073938317332>')
                );

            const msg = await message.reply({ embeds: [embed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const filterMainButton = i => i.customId === 'mainButton' && i.user.id === `${message.author.id}`;
            const filterLeftButton = i => i.customId === 'leftButton' && i.user.id === `${message.author.id}`;
            const filterDeleteButton = i => i.customId === 'deleteButton' && i.user.id === `${message.author.id}`;
            const filterRightButton = i => i.customId === 'rightButton' && i.user.id === `${message.author.id}`;
            const filterEndButton = i => i.customId === 'endButton' && i.user.id === `${message.author.id}`;

            const collectorMain = message.channel.createMessageComponentCollector({ filterMainButton, time: 1200000 });
            const collectorLeft = message.channel.createMessageComponentCollector({ filterLeftButton, time: 1200000 });
            const collectorDelete = message.channel.createMessageComponentCollector({ filterDeleteButton, time: 1200000 });
            const collectorRight = message.channel.createMessageComponentCollector({ filterRightButton, time: 1200000 });
            const collectorEnd = message.channel.createMessageComponentCollector({ filterEndButton, time: 1200000 });

            collectorMain.on('collect', async i => {
                if (i.customId === 'mainButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    if (page === 1) return;
                    page = 1;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter({ text: `${lang.requested_by[langs]} ${message.author.username} | ${lang.help_footer_pages[langs]} [${page}/${pages.length}]`, iconURL: message.member.user.displayAvatarURL({ dynamic: true}) });
                    msg.edit({ embeds: [embed] }).catch(err => {})
                }
            });

            collectorLeft.on('collect', async i => {
                if (i.customId === 'leftButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    if (page === 1) return;
                    page--;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter({ text: `${lang.requested_by[langs]} ${message.author.username} | ${lang.help_footer_pages[langs]} [${page}/${pages.length}]`, iconURL: message.member.user.displayAvatarURL({ dynamic: true}) });
                    msg.edit({ embeds: [embed] }).catch(err => {})
                }
            });

            collectorDelete.on('collect', async i => {
                if (i.customId === 'deleteButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    msg.delete().catch(err => {}) && message.delete().catch(err => {})
                }
            });

            collectorRight.on('collect', async i => {
                if (i.customId === 'rightButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter({ text: `${lang.requested_by[langs]} ${message.author.username} | ${lang.help_footer_pages[langs]} [${page}/${pages.length}]`, iconURL: message.member.user.displayAvatarURL({ dynamic: true}) });
                    msg.edit({ embeds: [embed] }).catch(err => {})
                }
            });

            collectorEnd.on('collect', async i => {
                if (i.customId === 'endButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    if (page === pages.length) return;
                    page = pages.length;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter({ text: `${lang.requested_by[langs]} ${message.author.username} | ${lang.help_footer_pages[langs]} [${page}/${pages.length}]`, iconURL: message.member.user.displayAvatarURL({ dynamic: true}) });
                    msg.edit({ embeds: [embed] }).catch(err => {})
                }
            })
        }else{
            
            let cmd = client.commands.get(args[0]);

            let errorCmd = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.help_command_undefined[langs]}`)
            .setTimestamp()
            if(!cmd) return message.reply({ embeds: [errorCmd], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            if(data.language == "Русский") {
                cmd_description = cmd.description  || `${lang.help_command_description_no[langs]}`
            } else if (data.language == "English") {
                cmd_description = cmd.description_en || `${lang.help_command_description_no[langs]}`
            } else if (data.language == "Українська") {
                cmd_description = cmd.description_ua || `${lang.help_command_description_no[langs]}`
            }

            if(data.language == "Русский") {
                cmd_example = cmd.example || `${lang.help_command_description_no[langs]}`
            } else if (data.language == "English") {
                cmd_example = cmd.example_en || `${lang.help_command_description_no[langs]}`
            } else if (data.language == "Українська") {
                cmd_example = cmd.example_ua || `${lang.help_command_description_no[langs]}`
            }

            let cmdEmbed = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${lang.help_command_name[langs]} ${cmd.name}`)
            .setDescription(`${cmd_description}`)
            .addField(`${lang.information[langs]}`, `${lang.command_help_aliases[langs]} **${cmd.aliases || `${lang.help_command_description_no[langs]}`}**\n${lang.command_help_module[langs]} **${cmd.module || `${lang.help_command_description_no[langs]}`}**\n${lang.command_help_cooldown[langs]} **${cmd.cooldown || `${lang.help_command_description_no[langs]}`}**\n${lang.command_help_usage[langs]} **${prefix}${cmd.usage || `${lang.help_command_description_no[langs]}`}**\n${lang.command_help_example_usage[langs]} **${cmd_example}**`)
            message.reply({ embeds: [cmdEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
      } catch (e) {
          console.log(e)
      }
    }
}
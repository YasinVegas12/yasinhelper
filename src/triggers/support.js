const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const BanSupport = require("../structures/BanSupportSchema.js");
const Bans = require("../structures/BotBlackListSchema.js");
const Ticket = require("../structures/TicketSchema.js");
const lang = require("../language.json");

let cooldownTicket = new Set();
let cdsecondsTicket = 30;

module.exports = async (client, message) => {

    if(message.channel.type === "DM") return;
    if(message.author.bot) return;

    try {

        let data = await Guild.findOne({
            guildID: message.guild.id
        });

        if(!data) return;

        let supportchannel = data.supportchannel
        let channel = message.guild.channels.cache.find(c => c.name == supportchannel) || message.guild.channels.cache.find(c => c.id == supportchannel);

        if(message.channel == channel) {
    
            let langs = data.language
            let supportrole = data.supportrole
            let moderator_role = message.guild.roles.cache.filter(r => supportrole.includes(r.id));
            let roles = moderator_role.sort((a, b) => b.position - a.position).map(role => role.toString()) 
            let a_categ = data.activeCategory
            let prefix = data.prefix

            const ownerTAG = await client.users.fetch("817383783145537556").then(u => u.tag);

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmdName = args.shift().toLowerCase();
            const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

            message.delete().catch(err => {})

            if (command) {
                let commandEmbed = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.support_command[langs]}`)
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
                return message.reply({ embeds: [commandEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgCommand) => {
                    setTimeout(() => {
                        msgCommand.delete().catch(err => {});
                    }, 10000);
                });
            }

            let dataBAN = await Bans.findOne({
                userID: message.author.id,
                status: true
            });
        
            if(dataBAN) {
                let blockEmbed = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.blacklist_description[langs]} \`${dataBAN.reason}\`\n\n${lang.blacklist_two_description[langs]} \`${ownerTAG}\``)
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
                return message.reply({ embeds: [blockEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgBlacklist) => {
                    setTimeout(() => {
                        msgBlacklist.delete().catch(err => {});
                    }, 10000);
                });
            }

            if(!message.guild.me.permissions.has(["ADMINISTRATOR"])) {
                let warningBotPermission = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.support_permissions[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgBotPermission) => {
                    setTimeout(() => {
                        msgBotPermission.delete().catch(err => {});
                    }, 10000);
                });
            }

            let supportBAN = await BanSupport.findOne({
                userID: message.author.id,
                guildID: message.guild.id,
                current: true
            });
          
            if(supportBAN) {
                let sBan = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.bansupport_send[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [sBan], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgSupportBan) => {
                    setTimeout(() => {
                        msgSupportBan.delete().catch(err => {});
                    }, 10000);
                });
            }

            if(cooldownTicket.has(message.author.id)) {
                let warningTime = new MessageEmbed()
                .setColor(`#f00000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.cd_ticket[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [warningTime], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgCooldown) => {
                    setTimeout(() => {
                        msgCooldown.delete().catch(err => {});
                    }, 10000);
                });
             }
          
            if(message.content.length > 800 || message.content.length < 1) {
                let errorText = new MessageEmbed()
                .setColor(`#f00000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.length_text_ticket[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorText], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgContent) => {
                    setTimeout(() => {
                        msgContent.delete().catch(err => {});
                    }, 10000);
                });
            }

            if (!supportrole || supportrole.length === 0) {
                let moder_role = new MessageEmbed()
                .setColor(`#f00000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.ticket_norole[langs]} ${lang.ticket_norole_too[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [moder_role], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgRole) => {
                    setTimeout(() => {
                        msgRole.delete().catch(err => {});
                    }, 10000);
                });
            }

            if (roles.length === 0) {
                let undefined_moder_role = new MessageEmbed()
                .setColor(`#f00000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.supportrole_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [undefined_moder_role], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgRoleUndefined) => {
                    setTimeout(() => {
                        msgRoleUndefined.delete().catch(err => {});
                    }, 10000);
                });
            }
            
            if(message.member.roles.cache.some(r => moderator_role.some(role => role.id == r.id))) {
                let youModerator = new MessageEmbed()
                .setColor(`#f00000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.support_nocreate[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [youModerator], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgMod) => {
                    setTimeout(() => {
                        msgMod.delete().catch(err => {});
                    }, 10000);
                });
            }

            let a_category = await message.guild.channels.cache.find(c => c.name == a_categ) || message.guild.channels.cache.find(c => c.id == a_categ);

            if(!a_category) {
                let activeIsNotDefined = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.ticket_category[langs]} \`${data.activeCategory}\` ${lang.ticket_category_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [activeIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgCategory) => {
                    setTimeout(() => {
                        msgCategory.delete().catch(err => {});
                    }, 10000);
                });
            }

            if(a_category.children.size >= 45) {
                let activeChildren = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.children_size[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [activeChildren], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgSize) => {
                    setTimeout(() => {
                        msgSize.delete().catch(err => {});
                    }, 10000);
                });
            }

            if(message.attachments.first()) {
                let type = message.attachments.first().contentType

                let errorImage = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.error_image_text[langs]}`)
                .setTimestamp()
                if (!type.includes("image/")) return message.reply({ embeds: [errorImage], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then((msgImage) => {
                    setTimeout(() => {
                        msgImage.delete().catch(err => {});
                    }, 10000);
                });
            }

            const users_to_support = [{
                id: message.guild.id,
                deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`]
            }]

            users_to_support.push({
                id: message.author.id,
                allow: [`VIEW_CHANNEL`,`SEND_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`USE_EXTERNAL_EMOJIS`],
                deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`]
            });

            moderator_role.forEach(moderator => {
                users_to_support.push({
                    id: moderator.id,
                    allow: ['VIEW_CHANNEL','SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'],
                    deny: ['CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'REQUEST_TO_SPEAK', 'USE_APPLICATION_COMMANDS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS']
                })
            })

            const channel = await message.guild.channels.create(`ticket-${data.numberticket}`, {
                type: "GUILD_TEXT",
                parent: a_category.id,
                permissionOverwrites: users_to_support
            });

            await new Ticket({
                guildID: message.guild.id,
                userID: message.author.id,
                status: "Active",
                channelID: channel.id,
                numberTicket: data.numberticket
            }).save()
            
            data.numberticket +=1
            data.save()

            cooldownTicket.add(message.author.id);

            setTimeout(() =>{
                cooldownTicket.delete(message.author.id)
            }, cdsecondsTicket * 1000)

            let supportEmbed = new MessageEmbed()
            .setColor(`#34aeeb`)
            .setTitle(`${lang.title_support[langs]}`)
            .setDescription(`**👤 Tag:** \`${message.author.tag}\`\n**🌐 ID:** \`${message.author.id}\`\n**💬 ${lang.support_text_message[langs]}:** \`${message.content}\``)
            .setThumbnail(client.user.avatarURL())
            .setFooter({ text: `Ticket system © Yasin Helper`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            if(message.attachments.first()) supportEmbed.setImage(`${message.attachments.first().proxyURL}`)
            channel.send({ content: `<@${message.author.id}> \`${lang.support_channel_message[langs]}\` ${roles}`, embeds: [supportEmbed] }).catch(err => {})

            const msg = await message.channel.send(`<@${message.author.id}>, \`${lang.ticket_create[langs]}\` <#${channel.id}>`)

            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 10000);

            let reportschannel = data.reportschannel
            let channels = message.guild.channels.cache.find(c => c.name == reportschannel) || message.guild.channels.cache.find(c => c.id == reportschannel);

            if(channels) {
                let ticketCreate = new MessageEmbed()
                .setColor(`#00b0f0`)
                .setTitle(`${lang.reports_title[langs]}`)
                .setDescription(`**[CREATE]** \`${message.author.username}\` **${lang.reports_description[langs]}** <#${channel.id}> \`[${channel.name}]\``)
                .setFooter({ text: `${lang.reports_footer[langs]}` })
                .setTimestamp()
                await channels.send({ embeds: [ticketCreate] }).catch(err => {})
            }
        }
    } catch (e) {
        console.log(e)
    }
}
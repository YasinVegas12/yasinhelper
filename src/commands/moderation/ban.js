const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Prime = require("../../structures/PrimeSchema.js");
const User = require("../../structures/UserSchema.js");
const Historys = require("../../structures/HistorySchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "ban",
    module: "moderation",
    description: "Заблокировать пользователя на сервере",
    description_en: "Ban a user on the server",
    description_ua: "Заблокувати користувача на сервері",
    usage: "ban [@user/id] [reason(optional)]",
    example: "/ban 608684992335446064 test - заблокировать пользователя на сервере, указав айди\n/ban @Jason Kings#4090 test - заблокировать пользователя по пингу",
    example_en: "/ban 608684992335446064 test - ban a the user on the server by providing the id\n/ban @Jason Kings#4090 test - ban a user by mention",
    example_ua: "/ban 608684992335446064 test - заблокувати користувача на сервері",
    cooldown: 15,
  async run(client,message,args,langs,prefix,ownerTAG) {

    try {

        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });
    
        if (cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let data = await User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        });

        if (!data) {
            let errorMess = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`${lang.nodb[langs]} \`${ownerTAG}\``)
            .setTimestamp()
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        const developer = [
            config.developer,
        ];

        let noPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ban_no_permission[langs]}`)
        .setTimestamp() 
        if (!message.guild.me.permissions.has(["BAN_MEMBERS"])) return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ban_user_permission[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has(["BAN_MEMBERS"])) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideArgs = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ban_how[langs]}`)
        .setTimestamp()
        if (!args[0]) return message.reply({ embeds: [provideArgs], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let banMember = await message.guild.members.fetch(args[0]).catch(() => {}) || message.mentions.members.first()
    
        if(banMember) {
    
            let warningYou = new MessageEmbed()
            .setColor(`#fc0303`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.ban_you[langs]}`)
            .setTimestamp()
            if (banMember.user.id == message.author.id) return message.reply({ embeds: [warningYou], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            let reason = args.slice(1).join(" ");
            if (!reason) reason =`${lang.reason_no_provide[langs]}`
    
            let myRoleIsBelow = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.giverole_bot_position[langs]}`)
            .setTimestamp() 
            if (banMember.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [myRoleIsBelow], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            let roleHighestEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.kick_role[langs]}`)
            .setTimestamp()
            if(banMember.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [roleHighestEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('banButton')
                    .setStyle('SUCCESS')
                    .setEmoji('✅'),
                new MessageButton()
                    .setCustomId('exitButton')
                    .setStyle('DANGER')
                    .setEmoji('❌')
            )

            let embedBan = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.cmd_ban_accept[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cmd_ban_text[langs]} \`${banMember.user.tag}\``)

            const msg = await message.reply({ embeds: [embedBan], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const filterBanButton = i => i.customId === 'banButton' && i.user.id === `${message.author.id}`;
            const filterExitButton = i => i.customId === 'exitButton' && i.user.id === `${message.author.id}`;

            const collectorBan = message.channel.createMessageComponentCollector({ filterBanButton, time: 60000  });
            const collectorExit = message.channel.createMessageComponentCollector({ filterExitButton, time: 60000  });

            collectorBan.on('collect', async i => {
                if (i.customId === 'banButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    if(banMember) {
                        banMember.ban({
                        reason: `${reason} by ${message.author.tag}`
                    }).then(async() => { 
                        let banEmbedSend = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.ban_dm[langs]}`)
                        .setDescription(`${lang.description_ban[langs]} **${message.guild.name}**\n${lang.who_banned[langs]} \`${message.author.tag}\`\n${lang.ban_reason[langs]} **${reason}**`)
                        .setTimestamp()
                        banMember.send({ embeds: [banEmbedSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
            
                        let banEmbed = new MessageEmbed()
                        .setColor(`#33353C`)
                        .setTitle(`${lang.ban_title[langs]}`)
                        .setDescription(`<:uuuuuuuusssssssssssssseeeeeeeeer:977088592524496966> ${lang.ban_who_been_banned[langs]} \`${banMember.user.tag}\`\n<:kick:976356295122767883> ${lang.info_ban_user[langs]} \`${message.author.tag}\`\n<a:note:976150101397491732> ${lang.reason_caps[langs]} \`${reason}\``)
                        .setFooter({ text: `${lang.reports_footer[langs]}` });
                        data.giveban +=1
                        data.save()
            
                        await new Historys({
                            userID: banMember.id,
                            userTAG: banMember.user.tag,
                            guildID: message.guild.id,
                            text: `${lang.administrator[langs]} ${message.author.tag} ${lang.history_ban[langs]} ${banMember.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
                            staffID: message.author.id,
                            staffTAG: message.author.tag
                        }).save()
            
                        if (!dataPRIME) {
                            if(!developer.some(dev => dev == message.author.id)) {
                                cooldown.add(message.author.id);
                            }
            
                            setTimeout(() =>{
                                cooldown.delete(message.author.id)
                            }, cdseconds * 1000)
                        }

                        await i.update({ embeds: [banEmbed], components: [] }).catch(() => { })
                        }).catch(async err => {
                            if(err.message == `Missing Permissions`) {
                                let noBan = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(`${lang.title_error[langs]}`)
                                .setDescription(`\`${message.author.username}\`, ${lang.warn_no_ban[langs]}`)
                                .setTimestamp()
                                await i.update({ embeds: [noBan], components: [] }).catch(() => { })
                            }
                        })
                    }
                }
            });

            collectorExit.on('collect', async i => {
                if (i.customId === 'exitButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    let denyBan = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.successfull[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.cmd_ban_deny[langs]} \`${banMember.user.tag}\``)
                    .setTimestamp()
                    await i.update({ embeds: [denyBan], components: [] }).catch(() => { })
                }
            });
        } else {
            const banMember = await client.users.fetch(args[0]).catch(() => {});
        
            if (!banMember) {
                let warningUser = new MessageEmbed()
                .setColor('RED')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.ban_undefined[langs]}`)
                .setTimestamp()   
                return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        
            message.guild.bans.fetch(banMember.id).then(({user}) => {
                if(user) {
                    let alreadyBanned = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.cmd_ban_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [alreadyBanned], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
            }).catch(err => {
                if(err.message == `Unknown Ban`) {
                    let reason = args.slice(1).join(" ");
                    if (!reason) reason = `${lang.reason_no_provide[langs]}`

                    let embedBan = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.cmd_ban_accept[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.cmd_ban_text[langs]} \`${banMember.tag}\``)

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('banButton')
                                .setStyle('SUCCESS')
                                .setEmoji('✅'),
                            new MessageButton()
                                .setCustomId('exitButton')
                                .setStyle('DANGER')
                                .setEmoji('❌')
                        )

                    message.reply({ embeds: [embedBan], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                    const filterBanButton = i => i.customId === 'banButton' && i.user.id === `${message.author.id}`;
                    const filterExitButton = i => i.customId === 'exitButton' && i.user.id === `${message.author.id}`;

                    const collectorBan = message.channel.createMessageComponentCollector({ filterBanButton, time: 60000  });
                    const collectorExit = message.channel.createMessageComponentCollector({ filterExitButton, time: 60000  });

                    collectorBan.on('collect', async i => {
                        if (i.customId === 'banButton' && i.user.id === `${message.author.id}`) {
                            message.guild.members.ban(banMember.id, { reason: reason + " by " + message.author.username });
        
                            let banEmbed = new MessageEmbed()
                            .setColor(`#33353C`)
                            .setTitle(`${lang.ban_title[langs]}`)
                            .setDescription(`<:uuuuuuuusssssssssssssseeeeeeeeer:977088592524496966> ${lang.ban_who_been_banned[langs]} \`${banMember.tag}\`\n<:kick:976356295122767883> ${lang.info_ban_user[langs]} \`${message.author.tag}\`\n<a:note:976150101397491732> ${lang.reason_caps[langs]} \`${reason}\``)
                            .setFooter({ text: `${lang.reports_footer[langs]}` });
                            data.giveban +=1
                            data.save()
                
                            if(!dataPRIME) {
                                if(!developer.some(dev => dev == message.author.id)) {
                                    cooldown.add(message.author.id);
                                }
                
                                setTimeout(() => {
                                    cooldown.delete(message.author.id)
                                }, cdseconds * 1000)
                            }
                            await i.update({ embeds: [banEmbed], components: [] }).catch(() => { })
                        }
                    });

                    collectorExit.on('collect', async i => {
                        if (i.customId === 'exitButton' && i.user.id === `${message.author.id}`) {
                            let denyBan = new MessageEmbed()
                            .setColor(`RED`)
                            .setTitle(`${lang.successfull[langs]}`)
                            .setDescription(`\`${message.author.username}\`, ${lang.cmd_ban_deny[langs]} \`${banMember.tag}\``)
                            .setTimestamp()
                            await i.update({ embeds: [denyBan], components: [] }).catch(() => { })
                        }
                    });
                }
            })
        }
        } catch (e) {
            console.log(e)
        }
    }
}
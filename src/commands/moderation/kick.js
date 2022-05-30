const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Historys = require("../../structures/HistorySchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "kick",
    module: "moderation",
    description: "Выгнать пользователя с сервера",
    description_en: "Kick a user from the server",
    description_ua: "Вигнати користувача з сервера",
    usage: "kick [user id/@mention] [reason(optional)]",
    example: "/kick 608684992335446064 test - выгнать пользователя с сервера",
    example_en: "/kick 608684992335446064 test - kick a user from the server",
    example_ua: "/kick 608684992335446064 test - вигнати користувача з сервера",
    cooldown: 15,
  async run(client,message,args,langs,prefix,ownerTAG) {

    try {

        const developer = [
            config.developer,
        ];

        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        let data = await User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        });

        if (!data) return;

        if (cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kick_permission[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has(["KICK_MEMBERS"])) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let noPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kick_no_permission[langs]}`)
        .setTimestamp() 
        if (!message.guild.me.permissions.has(["KICK_MEMBERS"])) return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const kickMember = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        if (!kickMember) {
            let warningUser = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.kick_how[langs]} \`${prefix}kick [@user] [${lang.reason[langs]}]\``)
            .setTimestamp()   
            return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let warningYou = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.warn_you[langs]}`)
        .setTimestamp()
        if (kickMember.user.id == message.author.id) return message.reply({ embeds: [warningYou], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let reason = args.slice(1).join(" ");
        if (!reason) reason = `${lang.reason_no_provide[langs]}`

        let myRoleIsBelow = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_bot_position[langs]}`)
        .setTimestamp() 
        if (kickMember.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [myRoleIsBelow], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let roleHighnEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kick_role[langs]}`)
        .setTimestamp()
        if (kickMember.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [roleHighnEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('kickButton')
                    .setStyle('SUCCESS')
                    .setEmoji('✅'),
                new MessageButton()
                    .setCustomId('exitButton')
                    .setStyle('DANGER')
                    .setEmoji('❌')
            )

            let embedKick = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.cmd_ban_accept[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cmd_kick_text[langs]} \`${kickMember.user.tag}\``)

            const msg = await message.reply({ embeds: [embedKick], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const filterKickButton = i => i.customId === 'kickButton' && i.user.id === `${message.author.id}`;
            const filterExitButton = i => i.customId === 'exitButton' && i.user.id === `${message.author.id}`;

            const collectorKick = message.channel.createMessageComponentCollector({ filterKickButton, time: 60000  });
            const collectorExit = message.channel.createMessageComponentCollector({ filterExitButton, time: 60000  });

            collectorKick.on('collect', async i => {
                if (i.customId === 'kickButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                        kickMember.kick([`${reason} by ${message.author.tag}`]).then(async() => {
                            let kickEmbed = new MessageEmbed()
                            .setColor(`RED`)
                            .setTitle(`${lang.kick_title[langs]}`)
                            .setDescription(`${lang.kick_desciption_server[langs]} **${message.guild.name}**\n${lang.kick_description_user[langs]} \`${message.author.tag}\`\n${lang.kick_description_reason[langs]} **${reason}**`)
                            .setTimestamp()
                            kickMember.send({ embeds: [kickEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})

                            let embedKick = new MessageEmbed()
                            .setColor(`#33353C`)
                            .setTitle(`${lang.cmd_kick_title[langs]}`)
                            .setDescription(`<:uuuuuuuusssssssssssssseeeeeeeeer:977088592524496966> ${lang.who_kicked[langs]} \`${kickMember.user.tag}\`\n<:kick:976356295122767883> ${lang.kick_description_user[langs]} \`${message.author.tag}\`\n<a:note:976150101397491732> ${lang.reason_caps[langs]} \`${reason}\``)
                            .setFooter({ text: `${lang.reports_footer[langs]}` })

                            await i.update({ embeds: [embedKick], components: [] }).catch(() => { })
                        
                            data.givekick +=1
                            data.save()

                            await new Historys({
                                userID: kickMember.id,
                                userTAG: kickMember.user.tag,
                                guildID: message.guild.id,
                                text: `${lang.moderator[langs]} ${message.author.tag} ${lang.kick_history[langs]} ${kickMember.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
                                staffID: message.author.id,
                                staffTAG: message.author.tag
                            }).save()

                            if(!dataPRIME) {
                                if(!developer.some(dev => dev == message.author.id)) {
                                    cooldown.add(message.author.id);
                                }
                        
                                setTimeout(() => {
                                    cooldown.delete(message.author.id)
                                }, cdseconds * 1000)
                            }
                        }).catch(async err => {
                            if(err.message == `Missing Permissions`) {
                                let noKick = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(`${lang.title_error[langs]}`)
                                .setDescription(`\`${message.author.username}\`, ${lang.kick_warn_permissions[langs]}`)
                                .setTimestamp()
                                await i.update({ embeds: [noKick], components: [] }).catch(() => { })
                            }
                        });
                    }
                });

            collectorExit.on('collect', async i => {
                if (i.customId === 'exitButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    let denyKick = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.successfull[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.cmd_kick_deny[langs]} \`${kickMember.user.tag}\``)
                    .setTimestamp()
                    await i.update({ embeds: [denyKick], components: [] }).catch(() => { })
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}

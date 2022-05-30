const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Historys = require("../../structures/HistorySchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");
const wait = require('util').promisify(setTimeout);

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "history",
    module: "moderation",
    description: "Посмотреть историю наказаний",
    description_en: "View the history of punishments",
    description_ua: "Переглянути історію покарань",
    usage: "history",
    example: "/history - посмотреть свою историю наказаний\n/history 608684992335446064 - посмотреть историю наказаний пользователя",
    example_en: "/history - view your history of punishments\n/history 608684992335446064 - view the history of the users punishments",
    example_ua: "/history - переглянути свою історию покарань\n/history 608684992335446064 - переглянути історію покарань користувача",
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
        .setDescription(`\`${message.author.username}\`, ${lang.mute_list_permissons[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("KICK_MEMBERS")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

        const previousHistory = await Historys.find({
            userID: member.id,
            guildID: message.guild.id
        });

        const generateEmbed = start => {
            const current = previousHistory.slice(start, start + 10)
            let historyEmbed = new MessageEmbed()
            .setColor(`#32a0a8`)
            .setTitle(`${lang.history_title_one[langs]} ${member.user.tag} | ${lang.history_title[langs]} ${previousHistory.length}`)
            .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            current.forEach(u => historyEmbed.addField(`${lang.history_number_punish[langs]} ${start++ +1}`,`**${lang.history_punishment[langs]}** ${u.text}`))
            return historyEmbed
        }

        let currentIndex = 0

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('leftButton')
                .setStyle('PRIMARY')
                .setEmoji('◀️'),
            new MessageButton()
                .setCustomId('deleteButton')
                .setStyle('DANGER')
                .setEmoji('❌'),
            new MessageButton()
                .setCustomId('rigthButton')
                .setStyle('PRIMARY')
                .setEmoji('▶️')
        )
      
        let msg = await message.reply({ embeds: [generateEmbed(0)], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterLeftButton = i => i.customId === 'leftButton' && i.user.id === `${message.author.id}`;
        const filterDeleteButton = i => i.customId === 'deleteButton' && i.user.id === `${message.author.id}`;
        const filterRigthButton = i => i.customId === 'rigthButton' && i.user.id === `${message.author.id}`;

        const collectorLeft = message.channel.createMessageComponentCollector({ filterLeftButton, time: 300000  });
        const collectorDelete = message.channel.createMessageComponentCollector({ filterDeleteButton, time: 300000  });
        const collectorRigth = message.channel.createMessageComponentCollector({ filterRigthButton, time: 300000  });

        collectorLeft.on('collect', async i => {
            if (i.customId === 'leftButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                if (currentIndex === 0) return;
                await i.deferUpdate().catch(err => {});
		        await wait(100);
                currentIndex -= 10
                msg.edit({ embeds: [generateEmbed(currentIndex)] }).catch(err => {});
            }
        });

        collectorDelete.on('collect', async i => {
            if (i.customId === 'deleteButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                message.delete().catch(err => {}) && msg.delete().catch(err => {})
            }
        });

        collectorRigth.on('collect', async i => {
            if (i.customId === 'rigthButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                if (currentIndex + 10 >= previousHistory.length) return;
                await i.deferUpdate().catch(err => {});
		        await wait(100);
                currentIndex += 10
                msg.edit({ embeds: [generateEmbed(currentIndex)] }).catch(err => {});
            }
        });

        if(!dataPRIME) {
            if(!developer.some(dev => dev == message.author.id)) {
                cooldown.add(message.author.id);
            }
    
            setTimeout(() => {
                cooldown.delete(message.author.id)
            }, cdseconds * 1000)
        }
        } catch (e) {
            console.log(e)
        }
    }
}
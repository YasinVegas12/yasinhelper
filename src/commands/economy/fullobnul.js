const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "fullobnul",
    aliases: ["fobnul", "obnul"],
    module: "economy",
    description: "Сделать полное обнуление экономики",
    description_en: "Make a complete reset of the economy",
    description_ua: "Зробити повне обнулення економіки",
    usage: "fullobnul",
    example: "/fullobnul",
    example_en: "/fullobnul",
    example_ua: "/fullobnul",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let data = await User.find({
            guildID: message.guild.id
        });

        if(!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) {
            let warningPermission = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.module_permissions[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(data.length === 0) {
            let lengthZero = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.fullobnul_zero[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [lengthZero], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('acceptButton')
                .setStyle('PRIMARY')
                .setEmoji('✅'),
            new MessageButton()
                .setCustomId('deleteButton')
                .setStyle('DANGER')
                .setEmoji('❌')
        )

        let fullObnulEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.fullobnul_args_yes[langs]}`)
        .setTimestamp()
        let msg = await message.reply({ embeds: [fullObnulEmbed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterAcceptButton = i => i.customId === 'acceptButton' && i.user.id === `${message.author.id}`;
        const filterDeleteButton = i => i.customId === 'deleteButton' && i.user.id === `${message.author.id}`;

        const collectorAccept = message.channel.createMessageComponentCollector({ filterAcceptButton, time: 300000  });
        const collectorDelete = message.channel.createMessageComponentCollector({ filterDeleteButton, time: 300000  });

        collectorAccept.on('collect', async i => {
            if (i.customId === 'acceptButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let yesObnul = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.fullobnul_yes[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [yesObnul], components: [] }).catch(() => { })
                for(i = 0; i < data.length; i++ ) {
                    data[i].money = 0
                    data[i].rubles = 0
                    data[i].Job_skill = 0
                    data[i].job = "безработный"
                    data[i].save()
                }
            }
        });

        collectorDelete.on('collect', async i => {
            if (i.customId === 'deleteButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let denyObnul = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.fullobnul_deny[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [denyObnul], components: [] }).catch(() => { })
            }
        });
        } catch (e) {
            console.log(e)
        }
    }
}
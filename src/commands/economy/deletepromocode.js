const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Promo = require("../../structures/PromocodeSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "deletepromocode",
    aliases: ["dp", "deletepromo"],
    module: "economy",
    description: "Удалить свой промокод",
    description_en: "Delete your promo code",
    description_ua: "Видалити свій промокод",
    usage: "deletepromocode",
    example: "/deletepromocode - удалить свой промокод",
    example_en: "/deletepromocode - delete your promocode",
    example_ua: "/deletepromocode - видалити свій промокод",
  async run(client,message,args,langs,prefix) {

    try {

        let dat = await Promo.findOne({
            guildID: message.guild.id,
            ownerpromoID: message.author.id
        });

        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });

        if (!data) return;

        if (!dat) {
            let promoCreate = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.deletepromocode_no[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [promoCreate], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let sendEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.deletepromocode_text[langs]} \`${dat.promocode}\`\n\n${lang.deletepromocode_text_two[langs]}`)
        .setTimestamp()

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('acceptButton')
                .setStyle('SUCCESS')
                .setEmoji('✅'),
            new MessageButton()
                .setCustomId('denyButton')
                .setStyle('DANGER')
                .setEmoji('❌')
        )

        let msg = await message.reply({ embeds: [sendEmbed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterAcceptButton = i => i.customId === 'accceptButton' && i.user.id === `${message.author.id}`;
        const filterDenyButton = i => i.customId === 'denyButton' && i.user.id === `${message.author.id}`;

        const collectorAccept = message.channel.createMessageComponentCollector({ filterAcceptButton, time: 120000 });
        const collectorDeny = message.channel.createMessageComponentCollector({ filterDenyButton, time: 120000 });

        collectorAccept.on('collect', async i => {
            if (i.customId === 'acceptButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let yesObnul = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.deletepromocode_successfull[langs]} \`${dat.promocode}\``)
                .setTimestamp()
                await i.update({ embeds: [yesObnul], components: [] }).catch(() => { })
                await Promo.deleteOne({
                    guildID: message.guild.id
                });
            }
        });

        collectorDeny.on('collect', async i => {
            if (i.customId === 'denyButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let denyObnul = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.deletepromocode_no_text[langs]}`)
                .setTimestamp()
                await i.update({ embeds: [denyObnul], components: [] }).catch(() => { })
            }
        });
    } catch (e) {
        console.log(e)
    }
  }
}
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "fish",
    module: "economy",
    description: "Порыбачить",
    description_en: "Fishing",
    description_ua: "Порибалити",
    usage: "fish",
    example: "/fish",
    example_en: "/fish",
    example_ua: "/fish",
  async run(client,message,args,langs,prefix) {

    try {

        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });

        if (!data) return;

        let zeroWorms = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.zero_worms[langs]}`)
        .setTimestamp()
        if (data.worms === 0) return message.reply({ embeds: [zeroWorms], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let timefish = Math.floor(Math.random() * 15000);

        let fishs = [
            `🐟 ${lang.common_fish[langs]}`,
            `🐠 ${lang.tropical_fish[langs]}`,
            `🐡 ${lang.needlefish[langs]}`,
            `🦈 ${lang.shark[langs]}`,
            `🐬 ${lang.dolphin[langs]}`,
            `🐳 ${lang.keith[langs]}`,
        ];

        let second = Math.floor(Math.random() * 999);
        let result1 = Math.floor((Math.random() * fishs.length));
        let rmoney = Math.floor(Math.random() * 19999) + 1;

        let startFish = new MessageEmbed()
        .setColor(`BLUE`)
        .setDescription(`${lang.fish_text[langs]}`)
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('acceptButton')
                    .setStyle('SUCCESS')
                    .setEmoji('✅')
            )

        const msg = await message.reply({ embeds: [startFish], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterAcceptButton = i => i.customId === 'acceptButton' && i.user.id === `${message.author.id}`;

        const collectorAccept = message.channel.createMessageComponentCollector({ filterAcceptButton, time: 60000  });

        collectorAccept.on('collect', async i => {
            if (i.customId === 'acceptButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let awaitEmbed = new MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`${lang.fish_wait[langs]}`)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()

                setTimeout(async() => {
                    let embed = new MessageEmbed()
                    .setColor('42aaff')
                    .setTitle(`🎣 ${lang.fish_title[langs]}`)
                    .addField(`${lang.fish_field_one[langs]}:`, fishs[result1], true)
                    .addField(`${lang.fish_field_two[langs]}`, timefish + ` ${lang.ms[langs]}`, true)
                    .addField(`${lang.fish_field_three[langs]}`, `🐟 ${Math.floor(Math.random()*10)},${second} ${lang.kg[langs]}\n📏 ${Math.floor(Math.random()*50)},${second} ${lang.sm[langs]}`)
                    .addField(`${lang.fish_money[langs]} `, `💰 ${rmoney}`)
                    data.money += rmoney
                    data.save()
                    await msg.edit({ embeds: [embed], components: [] })
                }, timefish);

                data.worms -= 1
                data.save()
                await i.update({ embeds: [awaitEmbed], components: [] }).catch(() => { })
            }
        });
        } catch (e) {
            console.log(e)
        }
    }
}
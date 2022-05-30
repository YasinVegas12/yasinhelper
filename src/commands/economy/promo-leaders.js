const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Promo = require("../../structures/PromocodeSchema.js");
const lang = require("../../language.json");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "promo-leaders",
    aliases: ["pleaders", "promoleaders"],
    module: "economy",
    description: "Посмотреть таблицу лидеров по промокодам",
    description_en: "View the leaderboard for promo codes",
    description_ua: "Переглянути таблицю лідерів по промокодам",
    usage: "promo-leaders",
    example: "/promo-leaders",
    example_en: "/promo-leaders",
    example_ua: "/promo-leaders",
  async run(client,message,args,langs,prefix) {

    try {

        const promoEmbed = await Promo.find({
            guildID: message.guild.id
          }).sort([['usepromo','descending']])

          async function generate(index) {
            let embed = new MessageEmbed();
            embed.setColor(`#32a0a8`)
            embed.setTitle(`🏆 ${lang.ranking_top_promocode[langs]}`)
            embed.setFooter({ text: `${lang.footer_text[langs]} ${message.author.username}`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }) });
            let currentPromo = promoEmbed.slice(index, index + 10);
            let description = ``;
            for (let promo of currentPromo) {
              let u = await client.users.fetch(promo.ownerpromoID).catch(err => { console.log(err) });
              if (!u) { u = { tag: "Deleted#0000" } };
              description += `\n[${index == 0 ? '👑' : index + 1}] \`${u.tag}\`\n${lang.promo_leaders_promocode[langs]} \`${promo.promocode}\` | ${lang.promo_leaders_level[langs]} \`${promo.lvlpromo}\` | ${lang.promo_leaders_use[langs]} \`${promo.usepromo}\``;
              index++;
            }
            embed.setDescription(description);
            return embed;
        }

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

        let msg = await message.reply({ embeds: [await generate(0)], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterLeftButton = i => i.customId === 'leftButton' && i.user.id === `${message.author.id}`;
        const filterDeleteButton = i => i.customId === 'deleteButton' && i.user.id === `${message.author.id}`;
        const filterRigthButton = i => i.customId === 'rigthButton' && i.user.id === `${message.author.id}`;

        const collectorLeft = message.channel.createMessageComponentCollector({ filterLeftButton, time: 1800000 });
        const collectorDelete = message.channel.createMessageComponentCollector({ filterDeleteButton, time: 1800000 });
        const collectorRigth = message.channel.createMessageComponentCollector({ filterRigthButton, time: 1800000 });

        let currentIndex = 0;

        collectorLeft.on('collect', async i => {
            if (i.customId === 'leftButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                if (currentIndex === 0) return;
                await i.deferUpdate().catch(err => {});
		        await wait(100);
                currentIndex -= 10
                msg.edit({ embeds: [await generate(currentIndex)] }).catch(err => {});
            }
        });

        collectorDelete.on('collect', async i => {
            if (i.customId === 'deleteButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                message.delete().catch(err => {}) && msg.delete().catch(err => {})
            }
        });

        collectorRigth.on('collect', async i => {
            if (i.customId === 'rigthButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                if (currentIndex + 10 >= promoEmbed.length) return;
                await i.deferUpdate().catch(err => {});
		        await wait(100);
                currentIndex += 10
                msg.edit({ embeds: [await generate(currentIndex)] }).catch(err => {});
            }
        });
        } catch (e) {
            console.log(e)
        }
    }
}
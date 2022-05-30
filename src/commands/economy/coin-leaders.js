const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "coin-leaders",
    aliases: ["cleaders", "coinleaders", "cl"],
    module: "economy",
    description: "Посмотреть таблицу лидеров по коинам на сервере",
    description_en: "View the leaderboard for coins on the server",
    description_ua: "Переглянути таблицю лідерів по коінам",
    usage: "coin-leaders",
    example: "/coin-leaders",
    example_en: "/coin-leaders",
    example_ua: "/coin-leaders",
  async run(client,message,args,langs,prefix) {

    try {

        const users = await User.find({
            guildID: message.guild.id
        }).sort([['money', 'descending']])
      
        async function generate(index) {
            let embed = new MessageEmbed();
            embed.setColor(`#32a0a8`)
            embed.setTitle(`🏆 ${lang.ranking_top_money[langs]}`)
            embed.setFooter({ text: `${lang.footer_text[langs]} ${message.author.username}`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }) });
            let currentUsers = users.slice(index, index + 10);
            let description = ``;
            for (let user of currentUsers) {
              let u = await client.users.fetch(user.userID).catch(err => { console.log(err) });
              if (!u) { u = { tag: "Deleted#0000" } };
              description += `[${index == 0 ? '👑' : index + 1}] ${u.tag} - \`${user.money}\`\n`;
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

        const collectorLeft = message.channel.createMessageComponentCollector({ filterLeftButton, time: 2400000 });
        const collectorDelete = message.channel.createMessageComponentCollector({ filterDeleteButton, time: 2400000 });
        const collectorRigth = message.channel.createMessageComponentCollector({ filterRigthButton, time: 2400000 });

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
                if (currentIndex + 10 >= users.length) return;
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
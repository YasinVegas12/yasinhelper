const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const lang = require("../../language.json");

module.exports = {
    name: "prime",
    module: "info",
    description: "Посмотреть преимущества прайм подписки, а также узнать цену",
    description_en: "View the benefits of a prime subscription, as well as find out the price",
    description_ua: "Переглянути переваги прайм підписки, а також дізнатися ціну",
    usage: "prime",
    example: "/prime",
    example_en: "/prime",
    example_ua: "/prime",
  async run(client,message,args,langs,prefix,ownerTAG) {

    try {
        let selectEmbed = new MessageEmbed()
        .setColor(`BLUE`)
        .setTitle(`${lang.new_prime_title[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.new_prime_description[langs]}:`)
        .setTimestamp()

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('userPrime')
                    .setLabel(`${lang.new_prime_user[langs]}`)
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('guildPrime')
                    .setLabel(`${lang.new_prime_server[langs]}`)
                    .setStyle('PRIMARY')
        );

        const msg = await message.reply({ embeds: [selectEmbed], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterUserPrime = i => i.customId === 'userPrime' && i.user.id === `${message.author.id}`;
        const filterGuildPrime = i => i.customId === 'guildPrime' && i.user.id === `${message.author.id}`;

        const collectorUser = message.channel.createMessageComponentCollector({ filterUserPrime, time: 15000 });
        const collectorGuild = message.channel.createMessageComponentCollector({ filterGuildPrime, time: 15000 });

        collectorUser.on('collect', async i => {
            if (i.customId === 'userPrime' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let editEmbedUser = new MessageEmbed()
                .setColor(`#7272db`)
                .setTitle(`${lang.prime_title[langs]}`)
                .setDescription(`${lang.prime_description[langs]}\n\n1. ${lang.benefits_prime_one[langs]}\n2. ${lang.benefits_prime_two[langs]}\n3. ${lang.benefits_prime_three[langs]}\n4. ${lang.benefits_prime_four[langs]} \`${prefix}jobs\`\n5. ${lang.benefits_prime_five[langs]} \`${prefix}try\`\n6. ${lang.benefits_prime_six[langs]}.`)
                .addField(`${lang.prime[langs]}`, `**1. ${lang.prime_one_month[langs]}\n**2. ${lang.prime_three_months[langs]}\n**3. ${lang.prime_six_months[langs]}`, true)
                .addField(`${lang.value_pay[langs]}`, `**1. [Telegram](t.me/yasinhelperprime_bot)**\n**2. Qiwi (${lang.prime_monobank[langs]}** \`${ownerTAG}\`)`, true)
                .setImage(`https://media.discordapp.net/attachments/773091330569273364/799968546431434773/r5Y1ARwVwpksVkyhCN9aycHXMuTQH8BtkzMaZOPom83eLVtt5V7dSPMjhFeIgmuGEw5-d5AuvECpTeA.png`)
                await i.update({ embeds: [editEmbedUser], components: [] }).catch(() => { return; })
            }
        });

        collectorGuild.on('collect', async i => {
            if (i.customId === 'guildPrime' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                let editEmbedGuild = new MessageEmbed()
                .setColor(`#7272db`)
                .setTitle(`${lang.server_kings_prime_title[langs]}`)
                .setDescription(`${lang.server_kings_prime_benefits[langs]}\n\n1. ${lang.prime_server_one[langs]} \`${prefix}serverinfo\`\n2. ${lang.prime_server_two[langs]}\n3. ${lang.prime_server_three[langs]}.\n4. ${lang.prime_server_four[langs]}\n5. ${lang.prime_server_five[langs]}`)
                .addField(`${lang.prime[langs]}`, `**1. ${lang.prime_server_month[langs]}\n**2. ${lang.prime_server_three_month[langs]}\n**3. ${lang.prime_server_six_months[langs]}`, true)
                .addField(`${lang.value_pay[langs]}`, `**1. [Telegram](t.me/yasinhelperprime_bot)**\n**2. Qiwi (${lang.prime_monobank[langs]}** \`${ownerTAG}\`)`, true)
                .setImage(`https://media.discordapp.net/attachments/773091330569273364/799968546431434773/r5Y1ARwVwpksVkyhCN9aycHXMuTQH8BtkzMaZOPom83eLVtt5V7dSPMjhFeIgmuGEw5-d5AuvECpTeA.png`)
                await i.update({ embeds: [editEmbedGuild], components: [] }).catch(() => { return; })
            }
        });
    } catch (e) {
        console.log(e)
    }
  }
}
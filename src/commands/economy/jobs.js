const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");

module.exports = {
    name: "jobs",
    module: "economy",
    description: "Посмотреть список доступных работ",
    description_en: "View the list of available works",
    description_ua: "Переглянути список доступних робіт",
    usage: "jobs",
    example: "/jobs",
    example_en: "/jobs",
    example_ua: "/jobs",
  async run(client,message,args,langs,prefix) {

    try {

        let embed = new MessageEmbed()
        .setColor(`#3297a8`)
        .setTitle(`${message.author.username}, ${lang.jobs_title[langs]}`)
        .setDescription(`**1. 🧹• ${lang.cleaner[langs]}\n${lang.work_skill[langs]} \`0\` ⚙️\n${lang.salary[langs]} \`500\` 🪙\n\n2. 🛒• ${lang.seller[langs]}\n${lang.work_skill[langs]} \`50\` ⚙️\n${lang.salary[langs]} \`2000\` 🪙\n\n3. 🪙• ${lang.collector[langs]}\n${lang.work_skill[langs]} \`150\` ⚙️\n${lang.salary[langs]} \`5000\` 🪙\n\n4. 👷• ${lang.builder[langs]}\n${lang.work_skill[langs]} \`300\` ⚙️\n${lang.salary[langs]} \`10.000\` 🪙\n\n5. 🧑‍⚕️• ${lang.doctor[langs]}\n${lang.work_skill[langs]} \`500\` ⚙️\n${lang.salary[langs]} \`25.000\` 🪙\n\n6. ✈️• ${lang.pilot[langs]}\n${lang.work_skill[langs]} \`1000\` ⚙️\n${lang.salary[langs]} \`50.000\` 🪙\n\n7. 💻• ${lang.jobs_developer[langs]} Yasin Helper\n${lang.jobs_developer_need[langs]} \`1000 ${lang.jobs_developer_skill[langs]} Yasin Prime\` <:boost:971617326669631538>\n${lang.salary[langs]} \`100.000\` 🪙 ${lang.and[langs]} \`2\` ${lang.donate_rubles[langs]}.**`)
        .setFooter({ text: `${lang.jobs_footer[langs]} ${prefix}works ${lang.jobs_footer_too[langs]}` })
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } catch (e) {
            console.log(e)
        }
    }
}
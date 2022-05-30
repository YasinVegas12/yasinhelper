const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const ms = require("ms");
const { cd_job } = require("../../config.json");

module.exports = {
    name: "work",
    module: "economy",
    description: "Поработать и заработать денег",
    description_en: "Work and earn money",
    description_ua: "Попрацювати і заробити гроші",
    usage: "work",
    example: "/work",
    example_en: "/work",
    example_ua: "/work",
    cooldown: 3600000,
  async run(client,message,args,langs,prefix) {

    try {

        let data = await User.findOne({
            guildID: message.guild.id, 
            userID: message.author.id
        });
    
        if (!data) return;

        let noJob = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.no_job[langs]} \`${prefix}works\``)
        .setTimestamp()
        if(data.job == "безработный") return message.reply({ embeds: [noJob], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(data._work_time !== null && cd_job - (Date.now() - data._work_time) > 0) {
            let noWork = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.work_time[langs]} \`${ms(cd_job - (Date.now() - data._work_time))}\``)
            .setTimestamp()
            return message.reply({ embeds: [noWork], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(data.job =="Уборщик") {
            let navikjob = Math.floor(Math.random() * 2) + 1;

            let workEmbed = new MessageEmbed()
            .setColor(`#43eb34`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`**, ${lang.working[langs]} \`500\` 🪙**\n**${lang.work_skills[langs]}** \`${data.Job_skill + navikjob}\` ⚙️\n**${lang.balance[langs]}** \`${data.money + 500}\` 🪙`)
            .setTimestamp()
            message.reply({ embeds: [workEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.money +=500
            data.Job_skill += navikjob
            data._work_time = Date.now()
            data.save()
        } else if (data.job =="Продавец") {
            let navikjob = Math.floor(Math.random() * 2) + 1;

            let workEmbed = new MessageEmbed()
            .setColor(`#43eb34`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`**, ${lang.work_salles[langs]} \`2000\` 🪙**\n**${lang.work_skills[langs]}** \`${data.Job_skill + navikjob}\` ⚙️\n**${lang.balance[langs]}** \`${data.money + 2000}\` 🪙`)
            .setTimestamp()
            message.reply({ embeds: [workEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.money +=2000
            data.Job_skill +=navikjob
            data._work_time = Date.now()
            data.save()
        } else if (data.job =="Инкассатор") {
            let navikjob = Math.floor(Math.random() * 2) + 1;

            let workEmbed = new MessageEmbed()
            .setColor(`#43eb34`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`**, ${lang.work_collector[langs]} \`5000\` 🪙**\n**${lang.work_skills[langs]}** \`${data.Job_skill + navikjob}\` ⚙️\n**${lang.balance[langs]}** \`${data.money + 5000}\` 🪙`)
            .setTimestamp()
            message.reply({ embeds: [workEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.money +=5000
            data.Job_skill +=navikjob
            data._work_time = Date.now()
            data.save()
        } else if (data.job =="Строитель") {
            let navikjob = Math.floor(Math.random() * 2) + 1;

            let workEmbed = new MessageEmbed()
            .setColor(`#43eb34`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`**, ${lang.work_builder[langs]} \`10.000\` 🪙**\n**${lang.work_skills[langs]}** \`${data.Job_skill + navikjob}\` ⚙️\n**${lang.balance[langs]}** \`${data.money + 10000}\` 🪙`)
            .setTimestamp()
            message.reply({ embeds: [workEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.money +=10000
            data.Job_skill +=navikjob
            data._work_time = Date.now()
            data.save()
        } else if (data.job =="Врач") {
            let navikjob = Math.floor(Math.random() * 2) + 1;

            let workEmbed = new MessageEmbed()
            .setColor(`#43eb34`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`**, ${lang.work_doctor[langs]} \`25.000\` 🪙**\n**${lang.work_skills[langs]}** \`${data.Job_skill + navikjob}\` ⚙️\n**${lang.balance[langs]}** \`${data.money + 25000}\` 🪙`)
            .setTimestamp()
            message.reply({ embeds: [workEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.money +=25000
            data.Job_skill +=navikjob
            data._work_time = Date.now()
            data.save()
        } else if (data.job =="Пилот") {
            let navikjob = Math.floor(Math.random() * 2) + 1;

            let workEmbed = new MessageEmbed()
            .setColor(`#43eb34`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`**, ${lang.work_pilot[langs]} \`50.000\` 🪙**\n**${lang.work_skills[langs]}** \`${data.Job_skill + navikjob}\` ⚙️\n**${lang.balance[langs]}** \`${data.money + 50000}\` 🪙`)
            .setTimestamp()
            message.reply({ embeds: [workEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.money +=50000
            data.Job_skill +=navikjob
            data._work_time = Date.now()
            data.save()
        } else if (data.job =="Разработчик Yasin Helper") {
            let navikjob = Math.floor(Math.random() * 2) + 1;

            let workEmbed = new MessageEmbed()
            .setColor(`#43eb34`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`**, ${lang.work_developer[langs]} \`100.000\` 🪙 ${lang.and[langs]} \`2\` ${lang.donate_rubles[langs]}**\n**${lang.work_skills[langs]}** \`${data.Job_skill + navikjob}\` ⚙️\n**${lang.balance[langs]}** \`${data.money + 100000}\` 🪙\n**${lang.balance_donate[langs]}** \`${data.rubles +2}\``)
            .setTimestamp()
            message.reply({ embeds: [workEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.money +=100000
            data.Job_skill +=navikjob
            data.rubles +=2
            data._work_time = Date.now()
            data.save()
        }
        } catch (e) {
            console.log(e)
        }
    }
}
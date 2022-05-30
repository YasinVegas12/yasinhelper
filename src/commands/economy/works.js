const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "works",
    module: "economy",
    description: "Устроиться на работу",
    description_en: "Get a job",
    description_ua: "Працевлаштуватися на роботу",
    usage: "works [1-7]",
    example: "/works 1 - устроиться дворником",
    example_en: "/works 1 - get a job as a cleaner",
    example_ua: "/works 1 - працевлаштуватися прибиральником",
    cooldown: 15,
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let data = await User.findOne({
            guildID: message.guild.id, 
            userID: message.author.id
        });

        if (!data) return;
    
        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        let howToUse = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.use[langs]} \`${prefix}works [${lang.number_[langs]}](${lang.number_get[langs]} ${prefix}jobs)\``)
        .setTimestamp()
        if(args[0] !== '1' && args[0] !== '2' && args[0] !== `3` && args[0] !== `4` && args[0] !== `5` && args[0] !== `6` && args[0] !== `7`) return message.reply({ embeds: [howToUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(args[0] == `1`) {

            if(cooldown.has(message.author.id)) {
                let cooldownEmbed = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let job = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.job_uje[langs]}`)
            .setTimestamp()
            if(data.job == "Уборщик") return message.reply({ embeds: [job], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let jobEmbed = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.janitor[langs]}`)
            .setTimestamp()
            message.reply({ embeds: [jobEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.job ="Уборщик"
            data.save()

            if(!dataPRIME) {
                if(!developer.some(dev => dev == message.author.id)) {
                    cooldown.add(message.author.id);
                }
    
                setTimeout(() => {
                    cooldown.delete(message.author.id)
                }, cdseconds * 1000)
            }
        } else if (args[0] == `2`) {
        
                if(cooldown.has(message.author.id)) {
                    let cooldownEmbed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
        
                let nojobskill = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.text_one[langs]} \`50\` ${lang.text_two[langs]}`)
                .setTimestamp()
                if(data.Job_skill < 50) return message.reply({ embeds: [nojobskill], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let seller = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.text_three[langs]}`)
                .setTimestamp()
                if(data.job == "Продавец") return message.reply({ embeds: [seller], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let jobseller = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.text_four[langs]}`)
                .setTimestamp()
                message.reply({ embeds: [jobseller], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.job ="Продавец"
                data.save()

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }

                    setTimeout(() => {
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            } else if (args[0] == `3`) {
    
                    if(cooldown.has(message.author.id)) {
                        let cooldownEmbed = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
                        .setTimestamp()
                        return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    }
        
                    let nojobskill = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_one[langs]} \`150\` ${lang.text_two[langs]}`)
                    .setTimestamp()
                    if(data.Job_skill < 150) return message.reply({ embeds: [nojobskill], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                    let job = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_five[langs]}`)
                    .setTimestamp()
                    if(data.job == "Инкассатор") return message.reply({ embeds: [job], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
                    let jobEmbed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`${lang.successfull[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_six[langs]}`)
                    .setTimestamp()
                    message.reply({ embeds: [jobEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                    data.job ="Инкассатор"
                    data.save()

                    if(!dataPRIME) {
                        if(!developer.some(dev => dev == message.author.id)) {
                            cooldown.add(message.author.id);
                        }
            
                        setTimeout(() => {
                            cooldown.delete(message.author.id)
                        }, cdseconds * 1000)
                    }
            } else if (args[0] == `4`) {
                
                    if(cooldown.has(message.author.id)) {
                        let cooldownEmbed = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
                        .setTimestamp()
                        return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    }
        
                    let nojobskill = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_one[langs]} \`300\` ${lang.text_two[langs]}`)
                    .setTimestamp()
                    if(data.Job_skill < 300) return message.reply({ embeds: [nojobskill], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
                    let job = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_seven[langs]}`)
                    .setTimestamp()
                    if(data.job == "Строитель") return message.reply({ embeds: [job], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
                    let jobEmbed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`${lang.successfull[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_eigth[langs]}`)
                    .setTimestamp()
                    message.reply({ embeds: [jobEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                    data.job ="Строитель"
                    data.save()
    
                    if(!dataPRIME) {
                        if(!developer.some(dev => dev == message.author.id)) {
                            cooldown.add(message.author.id);
                        }
            
                        setTimeout(() => {
                            cooldown.delete(message.author.id)
                        }, cdseconds * 1000)
                    }
            } else if (args[0] == `5`) {
                
                    if(cooldown.has(message.author.id)) {
                        let cooldownEmbed = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
                        .setTimestamp()
                        return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    }
        
                    let nojobskill = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_one[langs]} \`500\` ${lang.text_two[langs]}`)
                    .setTimestamp()
                    if(data.Job_skill < 500) return message.reply({ embeds: [nojobskill], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
                    let job = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\` ${lang.text_doctor[langs]}`)
                    .setTimestamp()
                    if(data.job == "Врач") return message.reply({ embeds: [job], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
                    let jobEmbed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`${lang.successfull[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_doctor_two[langs]}`)
                    .setTimestamp()
                    message.reply({ embeds: [jobEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                    data.job ="Врач"
                    data.save()
    
                    if(!dataPRIME) {
                        if(!developer.some(dev => dev == message.author.id)) {
                            cooldown.add(message.author.id);
                        }
            
                        setTimeout(() =>{
                            cooldown.delete(message.author.id)
                        }, cdseconds * 1000)
                    }
            } else if (args[0] == `6`) {
                            
                    if(cooldown.has(message.author.id)) {
                        let cooldownEmbed = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
                        .setTimestamp()
                        return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    }
        
                    let nojobskill = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_one[langs]} \`1000\` ${lang.text_two[langs]}`)
                    .setTimestamp()
                    if(data.Job_skill < 1000) return message.reply({ embeds: [nojobskill], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
                    let job = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_pilot[langs]}`)
                    .setTimestamp()
                    if(data.job == "Пилот") return message.reply({ embeds: [job], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
                    let jobEmbed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`${lang.successfull[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.text_pilot_two[langs]}`)
                    .setTimestamp()
                    message.reply({ embeds: [jobEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                    data.job ="Пилот"
                    data.save()
    
                    if(!dataPRIME) {
                        if(!developer.some(dev => dev == message.author.id)) {
                            cooldown.add(message.author.id);
                        }
            
                        setTimeout(() =>{
                            cooldown.delete(message.author.id)
                        }, cdseconds * 1000)
                    }
            } else if (args[0] == `7`) {
    
                if(cooldown.has(message.author.id)) {
                    let cooldownEmbed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
    
                let nojobskill = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.text_one[langs]} \`1000\` ${lang.text_two[langs]}`)
                .setTimestamp()
                if(data.Job_skill < 1000) return message.reply({ embeds: [nojobskill], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let noKingsPrime = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.text_no_prime[langs]} \`Yasin Prime\`! ${lang.text_prime[langs]} \`${prefix}prime\``)
                .setTimestamp()
                if (!dataPRIME) return message.reply({ embeds: [noKingsPrime], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let job = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.text_developer[langs]}`)
                .setTimestamp()
                if(data.job == "Разработчик Yasin Helper") return message.reply({ embeds: [job], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let jobEmbed = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`**${lang.text_developer_two[langs]} \`100.000\` ${lang.kings_coins[langs]} ${lang.and[langs]} \`2\` ${lang.donate[langs]}**`)
                .setTimestamp()
                message.reply({ embeds: [jobEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.job ="Разработчик Yasin Helper"
                data.save()

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }
        
                    setTimeout(() =>{
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}
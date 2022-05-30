const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const Guild = require("../../structures/GuildSchema.js");

module.exports = {
    name: "embfield",
    module: "embed",
    description: "Добавить эмбеду поле",
    description_en: "Add an embed field",
    description_ua: "Додати ембеду поле",
    usage: "embfield [1-10] [name field]",
    example: "/embfield 1 тест - добавить тест поле в эмбед",
    example_en: "/embfield 1 тест - add a test field to embed",
    example_ua: "/embfield 1 тест - додати тест поле в ембед",
  async run(client,message,args,langs,prefix) {

    try {

        let data = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if(!data) return;

        let warningPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.embed_permissions[langs]}`)
        .setTimestamp()
        if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
  
        if (!args[0]) {
            let argsProvide = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embfield_provide_pole[langs]}\n\n${lang.embfield_zero_example[langs]} \`${prefix}embfield 1 Test\` - ${lang.embfield_zero_example_continue[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [argsProvide], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (isNaN(args[0])) {
            let provideNumber = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embfield_is_none[langs]}\n\n${lang.embfield_zero_example[langs]} \`${prefix}embfield 1 Test\` - ${lang.embfield_zero_example_continue[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [provideNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (+args[0] < 1 || +args[0] > 10) {
            let provideCorrectNumber = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embfield_max[langs]} '${prefix}embfield [${lang.emb_number[langs]} (1-10)] [${lang.znach[langs]}]'\``)
            .setTimestamp()
            return message.reply({ embeds: [provideCorrectNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (!args[1]) {
            let provideValue = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embfield_no[langs]}\n\n${lang.embfield_zero_example[langs]} \`${prefix}embfield 1 Test\` - ${lang.embfield_zero_example_continue[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [provideValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let cmd_value = args.slice(1).join(" ");

        const question = await message.reply({ content: `\`${lang.embfield_three[langs]} '${cmd_value}' ${lang.embfield_text[langs]}\n${lang.embfield_text_send[langs]} '-'\``, allowedMentions: { repliedUser: false }, failIfNotExists: false })
            const filter = m => m.author.id === `${message.author.id}`
            message.channel.awaitMessages({ filter,
                max: 1,
                time: 600000,
                errors: ['time'],
            }).then(async (answer) => {
                if (answer.first().content != "-") {
                    question.delete().catch(err => {});
                    setTimeout(async() => {
                        if(args[0] == 1) {
                            data.efield.setembed_fields_zero = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 2) {
                            data.efield.setembed_fields_one = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 3) {
                            data.efield.setembed_fields_two = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 4) {
                            data.efield.setembed_fields_three = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 5) {
                            data.efield.setembed_fields_four = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 6) {
                            data.efield.setembed_fields_five = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 7) {
                            data.efield.setembed_fields_six = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 8) {
                            data.efield.setembed_fields_seven = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 9) {
                            data.efield.setembed_fields_eigth = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }else if(args[0] == 10) {
                            data.efield.setembed_fields_nine = `${cmd_value}<=+=>${answer.first().content}`
                            data.save()
                        }
                    }, 1000);
                    answer.first().delete();
                    message.reply({ content: `${lang.embfield_edited[langs]} №${args[0]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    } else {
                        setTimeout(async() => {
                            if(args[0] == 1) {
                                data.efield.setembed_fields_zero = "нет",
                                data.save()
                            }else if(args[0] == 2) {
                                data.efield.setembed_fields_one = "нет",
                                data.save()
                            }else if(args[0] == 3) {
                                data.efield.setembed_fields_two = "нет",
                                data.save()
                            }else if(args[0] == 4) {
                                data.efield.setembed_fields_three = "нет",
                                data.save()
                            }else if(args[0] == 5) {
                                data.efield.setembed_fields_four = "нет",
                                data.save()
                            }else if(args[0] == 6) {
                                data.efield.setembed_fields_five = "нет",
                                data.save()
                            }else if(args[0] == 7) {
                                data.efield.setembed_fields_six = "нет",
                                data.save()
                            }else if(args[0] == 8) {
                                data.efield.setembed_fields_seven = "нет",
                                data.save()
                            }else if(args[0] == 9) {
                                data.efield.setembed_fields_eigth = "нет",
                                data.save()
                            }else if(args[0] == 10) {
                                data.efield.setembed_fields_nine = "нет",
                                data.save()
                            }
                        }, 1000);
                        question.delete().catch(err => {});
                    }
                }).catch(async () => {
                    question.delete().catch(err => {})
                });
        } catch (e) {
            console.log(e)
        }
    }
}
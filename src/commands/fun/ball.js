const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");

module.exports = {
    name: "ball",
    module: "fun",
    description: "Хрустальный шар",
    description_en: "Crystal Ball",
    description_ua: "Хрустальний шар",
    usage: "ball [question]",
    example: "/ball Яков топ? - Задать вопрос шару и получить ответ от него",
    example_en: "/ball Who are you? - Ask a question and get an answer from the ball",
    example_ua: "/ball Яків топ? - Задати питання шару і отримати відповідь від нього",
  async run(client,message,args,langs) {

    try {

        if (langs === "Русский") {
            ball_answer = ['Да.','Нет.','Возможно.','Не знаю.','Не думаю.','Не понял вопроса.', 'Думаю, да!', 'Хмм...', 'Тебе лучше не знать!', 'Мои источники говорят - нет!', 'Очень сомнительно.']
        } else if (langs === "English") {
            ball_answer = ['Yes.','No.','Maybe.','I don`t know.','I don`t think so.','I don`t understand the question.','I think so','Hmm...','You don`t want to know!','My sources say no!','Very doubtful.']
        } else if (langs === "Українська") {
            ball_answer = ['Так.','Ні.','Можливо.','Не знаю.','Не думаю.','Не зрозумів питання.','Думаю, так!','Хмм...','Тобі краще не знати!','Мої джерела кажуть ні!','Дуже сумнівно.']
        }

        let reason = args.join(' ');
    
        let noText = new MessageEmbed()
        .setColor(`#f00000`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ball_notext[langs]}`)
        .setTimestamp()
        if (reason.length < 1) return message.reply({ embeds: [noText], allowedMentions: { repliedUser: false }, failIfNotExists: false }) 
    
        var ball = ball_answer;
    
        let embed = new MessageEmbed()
        .setColor(`#6b6565`)
        .addField(`${lang.ball_who_question_asked[langs]}:`, `${message.author.username}`)
        .addField(`${lang.ball_your_question[langs]}:`, reason)
        .addField(`${lang.ball_balloon_response[langs]}:`, ball[Math.floor(Math.random () * ball.length)])
        .setThumbnail("http://www.pngmart.com/files/3/8-Ball-Pool-Transparent-PNG.png")
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        } catch (e) {
            console.log(e)
        }
    }
}
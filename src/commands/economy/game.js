const lang = require("../../language.json");

module.exports = {
    name: "game",
    module: "economy",
    description: "Сыграть в одну из трех игр",
    description_en: "Play one of three games",
    description_ua: "Зіграти в одну з трьох ігр",
    usage: "game [words/knb/pl]",
    example: "/game слова - сыграть в слова",
    example_en: "/game words - play in words",
    example_ua: "/game words - зіграти в слова",
  async run(client,message,args,langs,prefix) {

    try {

        if (!args[0]) {
            return message.reply({ content: `${lang.game_args_zero[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (args[0] !== 'слова' && args[0] !== 'кнб' && args[0] !== `пл` && args[0] !== `words` && args[0] !==`knb` && args[0] !==`pl`) return message.reply({ content: `${lang.game_play_description_one[langs]} ${prefix}${lang.game_play_description_two[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
            if (args[0] == 'слова' || args[0] == `words`) {
                    if(langs == "Русский") questions = [
                            { 'question': 'Кто является разработчиком бота Yasin Helper?', 'answers': ['yasin vegas', 'yasin_vegas','джейсон кингс'] },
                            { 'question': 'Какой город является столицей Кореи?', 'answers': ['сеул'] },
                            { 'question': 'Какой город является столицей Зимбабве?', 'answers': ['хараре'] },
                            { 'question': 'Какой газ является самым легким?', 'answers': ['водород'] },
                            { 'question': 'Как называется неделимая частица?', 'answers': ['атом'] },
                            { 'question': 'Что изучает ботаника?', 'answers': ['растения'] },
                            { 'question': 'Как называется молекула ДНК?', 'answers': ['хромосома'] },
                            { 'question': 'Как называется смерть всех представителей определённого вида?', 'answers': ['вымирание'] },
                            { 'question': 'Что такое диэлектрик для физика?', 'answers': ['воздух'] },
                            { 'question': 'Какой металл является самым тугоплавким?', 'answers': ['вольфрам'] },
                            { 'question': 'Какое поле появляется вокруг любого предмета?', 'answers': ['гравитационное', 'гравитация'] },
                            { 'question': 'Какой материк пересекается всеми меридианами?', 'answers': ['антарктида'] },
                            { 'question': 'Как называется путь вращения планеты вокруг Солнца?', 'answers': ['орбитой', 'орбита'] },
                            { 'question': 'Как называется ближайшая к Солнцу планета?', 'answers': ['меркурий'] },
                            { 'question': 'Что отображают послойной окраской на физических картах?', 'answers': ['рельеф'] },
                            { 'question': 'Как называется внешний слой строения Земли?', 'answers': ['земной корой', 'земная кора'] },
                            { 'question': 'Как называется жидкая ткань?', 'answers': ['кровь'] },
                            { 'question': 'Как называется сумма длин всех сторон многоугольника?', 'answers': ['периметр'] },
                            { 'question': 'У какой страны флаг в виде обычного зеленого полотна?', 'answers': ['ливии'] },
                            { 'question': 'Какой сок собирается весной?', 'answers': ['березовый'] },
                            { 'question': 'В каком месяце наступает весна в Австралии?', 'answers': ['сентябре'] },
                            { 'question': 'Какая часть растений первой отзывается на потепление весной?', 'answers': ['корни', 'корень'] },
                            { 'question': 'Какой весенний месяц в старину назывался травник?', 'answers': ['май'] },
                            { 'question': 'Какую птицу, согласно пословице, нужно встречать вместе с весной?', 'answers': ['грач'] },
                        ];
                     else if (langs == "English") questions = [
                            { 'question': 'Who is the developer of the Yasin Helper bot?', 'answers': ['yasin vegas', 'yasin_vegas'] },
                            { 'question': 'Which city is the capital of Korea?', 'answers': ['seoul'] },
                            { 'question': 'Which city is the capital of Zimbabwe?', 'answers': ['harare'] },
                            { 'question': 'Which gas is the lightest?', 'answers': ['hydrogen'] },
                            { 'question': 'What is the name of an indivisible particle?', 'answers': ['atom'] },
                            { 'question': 'What does botany study?', 'answers': ['plants'] },
                            { 'question': 'What is the name of the DNA molecule?', 'answers': ['chromosome'] },
                            { 'question': 'What is the name of the death of all members of a certain species?', 'answers': ['extinction'] },
                            { 'question': 'What is a dielectric for a physicist?', 'answers': ['air'] },
                            { 'question': 'Which metal is the most refractory?', 'answers': ['wolfram', 'tungsten'] },
                            { 'question': 'What field appears around any item?', 'answers': ['gravity field', 'gravitational field'] },
                            { 'question': 'Which continent is crossed by all the meridians?', 'answers': ['antarctica'] },
                            { 'question': 'What is the name of the path of the planet`s rotation around the Sun?', 'answers': ['orbit'] },
                            { 'question': 'What is the name of the planet closest to the Sun?', 'answers': ['mercury'] },
                            { 'question': 'What is displayed by layer-by-layer coloring on physical maps?', 'answers': ['terrain', 'relief'] },
                            { 'question': 'What is the name of the outer layer of the Earth`s structure?', 'answers': ['earth`s crust'] },
                            { 'question': 'What is the name of liquid tissue?', 'answers': ['blood', 'bloodstream'] },
                            { 'question': 'What is the sum of the lengths of all the sides of a polygon?', 'answers': ['perimeter', 'periphery'] },
                            { 'question': 'Which country has a flag in the form of an ordinary green canvas?', 'answers': ['libya'] },
                            { 'question': 'What kind of juice is collected in the spring?', 'answers': ['birch', 'birch tree', 'birch forest'] },
                            { 'question': 'What month is spring in Australia?', 'answers': ['september'] },
                            { 'question': 'Which part of the plants is the first to respond to warming in the spring?', 'answers': ['roots', 'root'] },
                            { 'question': 'What spring month in the old days was called travnik?', 'answers': ['may'] },
                            { 'question': 'What kind of bird, according to the proverb, should be met with spring?', 'answers': ['rook'] },
                        ];
                        else if (langs == "Українська") questions = [
                            { 'question': 'Хто являється засновником бота Yasin Helper?', 'answers': ['yasin vegas', 'yasin_vegas'] },
                            { 'question': 'Столиця Китая?', 'answers': ['сеул'] },
                            { 'question': 'Який город є столицею Зімбабве?', 'answers': ['хараре'] },
                            { 'question': 'Який газ є найлегшим?', 'answers': ['гідроген'] },
                            { 'question': 'Як називається неподільна частка?', 'answers': ['атом'] },
                            { 'question': 'Що вивчає ботаніка?', 'answers': ['рослини'] },
                            { 'question': 'Як називається молекула ДНК?', 'answers': ['хромосома'] },
                            { 'question': 'Як називається смерть усіх представників певного виду?', 'answers': ['вимирання'] },
                            { 'question': 'Що таке діелектрик для фізика?', 'answers': ['повітря'] },
                            { 'question': 'Який метал є найтугоплавкішим?', 'answers': ['вольфрам'] },
                            { 'question': 'Яке поле з’являється навколо будь-якого об’єкта?', 'answers': ['гравітаційне'] },
                            { 'question': 'Який материк перетинається всіма меридіанами?', 'answers': ['антарктида'] },
                            { 'question': 'Як називається шлях обертання планети навколо Сонця?', 'answers': ['орбіта', 'орбітою'] },
                            { 'question': 'Як називається найближча до Сонця планета?', 'answers': ['меркурій'] },
                            { 'question': 'Що відображають пошаровим забарвленням на фізичних картах?', 'answers': ['рельєф'] },
                            { 'question': 'Як називається зовнішній шар будови Землі?', 'answers': ['земна кора'] },
                            { 'question': 'Як називається рідка тканина?', 'answers': ['кров'] },
                            { 'question': 'Як називається сума довжин усіх сторін багатокутника?', 'answers': ['периметр'] },
                            { 'question': 'Яка країна має прапор у вигляді звичайного зеленого полотна?', 'answers': ['лівії', 'лівія'] },
                            { 'question': 'Який сік збирається навесні?', 'answers': ['березовий'] },
                            { 'question': 'Якого місяця настає весна в Австралії?', 'answers': ['вересень'] },
                            { 'question': 'Яка частина рослин першою відгукується на потепління навесні?', 'answers': ['корні', 'коріння'] },
                            { 'question': 'Який весняний місяць за старих часів називався травник?', 'answers': ['травень'] },
                            { 'question': 'Якого птаха, згідно з прислів`ям, потрібно зустрічати разом із весною?', 'answers': ['грач'] },
                        ];
                    let question = questions[Math.floor(Math.random() * questions.length)];
                    let question_message = await message.reply({ content: `${lang.game_play_words[langs]}\n\`\`\`glsl\n# ${question.question}\n\`\`\`${lang.game_play_words_too[langs]} ${prefix}${lang.game_play_words_sree[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    const filter = m => m.author.id === `${message.author.id}`
                    await question_message.channel.awaitMessages({ filter,
                        max: 1,
                        time: 600000,
                        errors: ['time'],
                    }).then(answer => {
                        if (question.answers.some(response => response == answer.first().content.toLowerCase())) {
                            message.reply({ content: `${lang.game_play_won[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                            return question_message.delete().catch(() => { });
                        } else if (answer.first().content.toLowerCase() == `${prefix}stop слова` || answer.first().content.toLowerCase() == `${prefix}stop words`) {
                            message.reply({ content: `${lang.game_play_stop_words[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                            return question_message.delete().catch(err => {})
                        } else if (question.answers.some(response => response != answer.first().content.toLowerCase())) {
                            message.reply({ content: `${lang.game_wrong_answer[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                            return question_message.delete().catch(() => { });
                        }
                    }).catch(() => {
                        message.reply({ content: `${lang.game_play_time[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        return question_message.delete().catch(() => { });
                    }).catch(err => {
                        message.reply({ content: `${err}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        return message.delete().catch(err => {})
                    });
                } else if (args[0] == 'кнб' || args[0] == `knb`) {
                    if(langs == "Русский") questions = [
                        { 'question': 'Камень, ножницы, бумага?', 'answers': ['камень'] },
                        { 'question': 'Камень, ножницы, бумага?', 'answers': ['ножницы'] },
                        { 'question': 'Камень, ножницы, бумага?', 'answers': ['бумага'] },
                    ];
                 else if (langs == "English") questions = [
                        { 'question': 'Stone, paper, scissors?', 'answers': ['stone'] },
                        { 'question': 'Stone, paper, scissors?', 'answers': ['paper'] },
                        { 'question': 'Stone, paper, scissors?', 'answers': ['scissors'] },
                    ];
                    else if (langs == "Українська") questions = [
                        { 'question': 'Каміння, ножиці, папер?', 'answers': ['каміння'] },
                        { 'question': 'Каміння, ножиці, бумага', 'answers': ['ножиці'] },
                        { 'question': 'Каміння, ножиці, бумага?', 'answers': ['бумага'] },
                    ];
                    let question = questions[Math.floor(Math.random() * questions.length)];
                    let question_message = await message.reply({ content: `${lang.game_knb_message[langs]}\`\`\`glsl\n# ${question.question}\n\`\`\`${lang.game_knb_message_too[langs]} ${prefix}${lang.game_knb_message_three[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    const filter = m => m.author.id === `${message.author.id}`
                    await question_message.channel.awaitMessages({ filter,
                        max: 1,
                        time: 10000,
                        errors: ['time'],
                    }).then(answer => {
                        if (question.answers.some(response => response == answer.first().content.toLowerCase())) {
                            message.reply({ content: `${lang.game_knb_message_won[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                            return question_message.delete().catch(() => { });
                        } else if (answer.first().content.toLowerCase() == `${prefix}stop кнб` || answer.first().content.toLowerCase() == `${prefix}stop knb`) {
                            message.reply({ content: `${lang.game_play_stop_words[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                            return question_message.delete().catch(err => {})
                        } else if (question.answers.some(response => response != answer.first().content.toLowerCase())) {
                            message.reply({ content: `${lang.game_knb_wrong_answer[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                            return question_message.delete().catch(() => { });
                        }
                    }).catch(() => {
                        message.reply({ content: `${lang.game_knb_message_time[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        return question_message.delete().catch(() => { });
                    }).catch(err => {
                        message.reply({ content: `${err}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        return message.delete().catch(err => {})
                    });
            } else if (args[0] == 'пл' || args[0] == `pl`) {
                if(langs == "Русский") questions = [
                    { 'question': 'Ворона и сорока — это одно и то же?', 'answers': ['ложь', 'вранье','нет'] },
                    { 'question': 'Мэри Поппинс родом из Франции?', 'answers': ['ложь', 'вранье', 'нет'] },
                    { 'question': 'Судно с двумя корпусами — это катамаран?', 'answers': ['ложь', 'вранье', 'нет'] },
                    { 'question': 'Столица Египта — это Каир?', 'answers': ['правда', 'да', 'конечно'] },
                    { 'question': 'Коалы обитают в Норвегии?', 'answers': ['ложь', 'нет', 'не правда', 'вранье'] },
                    { 'question': 'Хомяки являются хищниками?', 'answers': ['ложь','нет','не правда','вранье'] },
                    { 'question': 'Голландия — это то же самое, что и Нидерланды?', 'answers': ['правда','да','ага'] },
                    { 'question': 'Ежи впадают в спячку?', 'answers': ['да','правда','ага','угу'] },
                    { 'question': 'Коровы относятся к травоядным?', 'answers': ['да', 'правда','угу','ага'] },
                    { 'question': 'После мая наступает апрель?', 'answers': ['нет', 'ложь', 'не правда'] },
                    { 'question': 'Синхронная ходьба — это командный вид спорта?', 'answers': ['нет', 'ложь','не правда'] },
                    { 'question': 'Греция была столицей Рима?', 'answers': ['нет','ложь','не правда'] },
                ];
             else if (langs == "English") questions = [
                    { 'question': 'A crow and a magpie are the same thing?', 'answers': ['lying', 'no','false'] },
                    { 'question': 'Mary Poppins is originally from France?', 'answers': ['lying', 'no', 'false'] },
                    { 'question': 'A vessel with two hulls is a catamaran?', 'answers': ['true', 'yes', 'sure'] },
                    { 'question': 'Is the capital of Egypt Cairo?', 'answers': ['true', 'yes', 'sure'] },
                    { 'question': 'Do Koalas live in Norway?', 'answers': ['lying', 'no', 'false'] },
                    { 'question': 'Are hamsters predators?', 'answers': ['no','false','lying'] },
                    { 'question': 'Is Holland the same as the Netherlands?', 'answers': ['yes','true','sure'] },
                    { 'question': 'Do hedgehogs hibernate?', 'answers': ['yes','true','sure'] },
                    { 'question': 'Are cows herbivores?', 'answers': ['yes', 'true','sure'] },
                    { 'question': 'After May comes April?', 'answers': ['no', 'sure', 'false'] },
                    { 'question': 'Is synchronized walking a team sport?', 'answers': ['no', 'false','lying'] },
                    { 'question': 'Was Greece the capital of Rome?', 'answers': ['no','false','lying'] },
                ];
                else if (langs == "Українська") questions = [
                    { 'question': 'Ворона і сорока — це те саме?', 'answers': ['ні', 'брехня'] },
                    { 'question': 'Мері Поппінс родом із Франції?', 'answers': ['ні', 'брехня'] },
                    { 'question': 'Судно із двома корпусами — це катамаран?', 'answers': ['так', 'правда'] },
                    { 'question': 'Столиця Єгипту – це Каїр?', 'answers': ['так', 'правда'] },
                    { 'question': 'Коали живуть у Норвегії?', 'answers': ['ні', 'брехня'] },
                    { 'question': 'Хом`яки є хижаками?', 'answers': ['ні','брехня'] },
                    { 'question': 'Голландія – це те саме, що й Нідерланди?', 'answers': ['так','правда'] },
                    { 'question': 'Їжаки впадають у сплячку?', 'answers': ['так','правда'] },
                    { 'question': 'Корови належать до травоїдних?', 'answers': ['так', 'правда'] },
                    { 'question': 'Після травня настає квітень?', 'answers': ['ні', 'брехня'] },
                    { 'question': 'Синхронна ходьба – це командний вид спорту?', 'answers': ['ні', 'брехня'] },
                    { 'question': 'Греція була столицею Риму?', 'answers': ['ні','брехня'] },
                ];
                let question = questions[Math.floor(Math.random() * questions.length)];
                let question_message = await message.reply({ content: `${lang.game_pl_question[langs]} \n\`\`\`glsl\n# ${question.question}\n\`\`\`${lang.game_pl_question_too[langs]} ${prefix}${lang.game_pl_question_three[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                const filter = m => m.author.id === `${message.author.id}`
                await question_message.channel.awaitMessages({ filter,
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(answer => {
                    if (question.answers.some(response => response == answer.first().content.toLowerCase())) {
                        message.reply({ content: `${lang.game_pl_won[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        return question_message.delete().catch(() => { });
                    } else if (answer.first().content.toLowerCase() == `${prefix}stop пл` || answer.first().content.toLowerCase() == `${prefix}stop pl`) {
                        message.reply({ content: `${lang.game_pl_stop[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        return question_message.delete().catch(err => {})
                    } else if (question.answers.some(response => response != answer.first().content.toLowerCase())) {
                        message.reply({ content: `${lang.game_wrong_answer[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        return question_message.delete().catch(() => { });
                    }
                }).catch(() => {
                    message.reply({ content: `${lang.game_pl_time[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    return question_message.delete().catch(() => { });
                }).catch(err => {
                    message.reply({ content: `${err}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    return message.delete().catch(err => {})
                });
            }
        } catch (e) {
            console.log(e)
        }
    }
}
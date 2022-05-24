/*
 * Параметры:
 * title			Заголовок окна
 * subtitle			Подзаголовок окна
 * callback			Функция, которая будет вызвана при нажатии на любую системную кнопку (нижния ряд) окна
 *					Туда будет передат порядковый номер кнопки
 * options			Другой вариант передачи параметров:
 * options.title	Заголовок окна
 * options.subtitle	Подзаголовок окна
 * options.buttons	Список кнопок для нижнего ряда, массив объектов с параметрами:
 * 					title 	надпись на кнопке
 * 
 * Варианты использования:
 * $.message(title: String) — в таком виде может просто заменить функцию alert
 * $.message(title: String, callback: String)
 * $.message(title: String, subtitle: String)
 * $.message(title: String, subtitle: String, callback: String)
 * $.message(options: Object, callback: String)
*/

$.message = function(){
	var opts = {}
	,	callback = function(){}
	switch(typeof arguments[0]){
		case 'string':
			opts.text = arguments[0]
			switch(typeof arguments[1]){
				case 'string':
					opts.subtext = arguments[1]
					callback = arguments[2] || callback
				break
				case 'function':
					callback = arguments[1]
				break
			}
		break
		case 'object':
			opts = arguments[0]
			callback = arguments[1] || callback
		break
	}

	opts.buttons = opts.buttons || [{
		title: 'OK'
	}]

	if(0 === $('.kd-message').length){
		$('body').append('<div class="kd-message"><div class="kd-message-window block"><div class="kd-message-window-text"></div><div class="kd-message-window-subtext"></div><div class="kd-message-window-buttons"></div></div></div>')
	}

	var el_message = $('.kd-message')
	,	el_message_window = el_message.find('.kd-message-window')
	,	el_message_buttons = el_message_window.find('.kd-message-window-buttons')

	el_message.find('.kd-message-window-text').html( opts.text.replace(/\n/g, '<br>') )

	if(undefined !== opts.subtext && opts.subtext.length > 0){
		el_message.find('.kd-message-window-text').append('<hr><small>' + opts.subtext.replace(/\n/g, '') + '</small>')
	}
	
	el_message_buttons.html('')

	$.each(opts.buttons, function(k, v){
		$('<div>')
		.append(
			$('<button>')
			.html(v.title)
			.on('click', function(){
				el_message.hide()
				callback(k)
			})
		)
		.appendTo(el_message_buttons)
	})

	el_message.show()

	el_message_window.css('margin-top', Math.max((el_message.height() - el_message_window.innerHeight()) * 0.33, 0) + 'px')
}
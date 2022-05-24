$(function() {
	var __random = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	var box = $('.lottery-wrapper').attr('id-box');
	var xguser = $("#xguser").text();
	var countscoll = $("#countscoll").text();

	var Carousel = function(container) {
		var self = this;
		var win = null;

		var carouselRequest = function() {
			container.find('.big-plays').attr('disabled', 'true');
			$("#btn_click").slideUp(1000);
			btnUseStrc = true;
			
			$.ajax({
				url: location.protocol + '//' + location.host + '/user/dailyBonus',
				type: 'GET', 
				dataType: 'json',
				data: {
					'getJson': 1
				},
				success: function(rdata) {
					if(rdata.status === true) {
						win = rdata.priz;
						carouselSpinPrepare(rdata, rdata.data);
					} else {
						toastr.info(rdata.message);
					}
				},
				error: function(a, b, c) {
					toastr.info('Произошла ошибка при запросе к серверу');
				}
			})
		}

		var carouselSpinPrepare = function(fulldata, data){
			var carousel_element = container.find('.lottery-game > .lottery-game-elements');
			carousel_element.children().removeAttr('data-win');
			var imagesReady = 0;

			$.each(data, function(k, v) {
				$('<div>').addClass('lottery-element lottery-element-slider col-md-1').attr('data-win', 1 === v.stop ? 'true' : undefined).html(v.percent + '' + v.name).appendTo(carousel_element);
			});

			!function() {
					carouselSpin(fulldata, carousel_element)
			}();
		}

		var carouselSpin = function(fulldata, carousel_element) {
			var win_element = carousel_element.children('[data-win="true"]');
			var	stopPixel = win_element.position().left + __random(Math.round(win_element.width() * 0.1), Math.round(win_element.width() * 0.9));
			
			var start = parseInt($('.lottery-game-elements').css('left'));
			var slot_width = $('.lottery-element').outerWidth(true);
			var offset = (win_element.position().left + Math.min(Math.max(Math.random(), .1), .9)) * start;
			var position = 0;
			
			interval = setInterval(function() {
				var offset = parseInt($('.lottery-game-elements').css('left')) - start;
				var	position_actual = Math.floor(offset / slot_width);

				position = position_actual;
			}, 10);
			
			carousel_element.delay(350).animate({
				left: -1 * stopPixel
			}, 350 * win_element.index(), 'easeOutQuad', function() {
				container.find('.big-plays').removeAttr('disabled');

				targetUnix = fulldata.infobonus.nextbonus+86400;
				$("#data_lastbonus").html(fulldata.infobonus.lastbonus);
				$(".bal-info").html('Баланс<b>:</b> ' + fulldata.infobonus.userbalance+ ' руб');
			})
		}

		!function init() {
			var carousel_element = container.find('.lottery-game > .lottery-game-elements');
			carousel_element.css({
				'left': -1 * container.find('.lottery-game > .line_lot').position().left + 'px',
				'margin-left': container.find('.lottery-game > .line_lot').position().left + 'px'
			});
			carousel_element.find('.lottery-element').slice(6).remove();

			carouselRequest();
		}();
	}

	$('.remodal').on('opened', function(){
		$(this).find('.market .big-plays').removeAttr('disabled');

		var container = $(this).find('.market');
		var	carousel_element = container.find('.lottery-game > .lottery-game-elements');

		carousel_element.css({
			'left': -1 * container.find('.lottery-game > .line_lot').position().left + 'px',
			'margin-left': container.find('.lottery-game > .line_lot').position().left + 'px'
		});

		carousel_element.stop(true);
		carousel_element.find('.lottery-element').slice(5).remove();

		
	});

	$(document).on('click', '.market .big-plays', function() {
		if(undefined === $(this).attr('disabled')) new Carousel( $(this).parents('.market').eq(0) )
	});
})
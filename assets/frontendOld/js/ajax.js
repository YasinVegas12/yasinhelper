// NOTIFICATION
var audio = new Audio();
function notify(message, timeout = 7000, type) {
    toastr.options.timeOut = timeout;
    toastr.options.progressBar = true;
    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-left';

    if(type == "info") toastr.info(message);
    if(type == "error") toastr.error(message);
    if(type == "success") toastr.success(message);
    if(type == "warning") toastr.warning(message);

    
    audio.src = '/assets/others/sounds/notify.mp3';
    audio.volume = 0.3;
    audio.play();

    message = "";
    timeout = "";
    type = "";
}

$(document).ready(function () {

	// AJAX SETUP
	$.ajaxSetup({
        'X-CSRF-Token': "{{csrf_token()}}"
    });

    var user_dashboard = "/user/dashboard";

	// AUTHORIZATION
	$(document).on('click', '#button_auth', function(e) {
        e.preventDefault();
        var formData = new FormData(document.getElementById("form_auth"));
        $.ajax({
            type: "POST",
            url: "/login",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                if(data.type == 'warning') {
                    notify(data.message, 8000, data.type);
                } else {
                    $('.captcha-main').slideUp(500);
                    notify("Авторизация прошла успешно, перенаправление...", 8000, "success");
                    setTimeout(function() {
                        window.location.href = user_dashboard;
                    }, 1000);
                }
            },
            error: function(data) {
		        if(data.status === 422) {
                    $('.captcha-image').attr('src', '/captcha/image?u=' + str_random(30));
                    $('[name="captcha"]').val('');
		            var errors = $.parseJSON(data.responseText);
		            $.each(errors, function (key, value) {
		                if($.isPlainObject(value)) {
		                    $.each(value, function (key, value) {
		                        notify(value, 8000, "warning");
		                    });
		                }
		            });
		        }
		    }
        });
    });

    // REGISTRATION
	$(document).on('click', '#button_regs', function(e) {
        e.preventDefault();
        var formData = new FormData(document.getElementById("form_regs"));
        console.log(formData);
        $.ajax({
            type: "POST",
            url: "/register",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                if(data.type == 'warning') {
                    notify(data.message, 8000, data.type);
                } else {
                    $('.captcha-main').slideUp(500);
                	notify("Регистрация прошла успешно, перенаправление...", 8000, "success");
                	setTimeout(function() {
                		window.location.href = user_dashboard;
                	}, 1000);
                }
            },
            error: function(data) {
		        if(data.status === 422) {
                    $('.captcha-image').attr('src', '/captcha/image?u=' + str_random(30));
                    $('[name="captcha"]').val('');
		            var errors = $.parseJSON(data.responseText);
		            $.each(errors, function (key, value) {
		                if($.isPlainObject(value)) {
		                    $.each(value, function (key, value) {
		                        notify(value, 8000, "warning");
		                    });
		                }
		            });
		        }
		    }
        });
    });

});

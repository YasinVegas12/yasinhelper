var notify_active = false;

function notify_modal() {
	$.ajax({
        type: 'POST',
        url: '/user/notify/modal',
        data: {
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            // console.log(data);
            if(data != "" && data != null && data != undefined) {
            	$('body').append(data);
            	notify_active = true;
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function notify_close() {
	notify_active = false;
}

$(document).ready(function() {

	notify_modal();
	setInterval(function() {
		if(notify_active == false) {
			notify_modal();
		}
	}, 10000);

});
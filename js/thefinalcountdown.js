var target = new Date("Aug 22, 2021").getTime();

function declinate(number, str1, str2, str3)
{
    var digits = String(number).slice(-2);
    if (digits[0] == "1" && digits.length == 2)
    {
        return str3;
    }
    else
    {
        var i = Number(digits[0]);
        if(digits.length == 2) i = Number(digits[1]);
        if (i == 0) {return str3;}
        else if (i == 1) {return str1;}
        else if (i < 5) {return str2;}
        else return str3;
    }
}

var i = setInterval(function () {

    var now = new Date().getTime();
    var remaining = target - now;

    if (remaining < 0) remaining = 0;

    var days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    $("#days").text(days.toString());
    $("#hours").text(hours.toString());
    $("#minutes").text(minutes.toString());
    $("#seconds").text(seconds.toString());

    $("#dunit").text(declinate(days, "день", "дня", "дней"));
    $("#hunit").text(declinate(hours, "час", "часа", "часов"));
    $("#munit").text(declinate(minutes, "минута", "минуты", "минут"));
    $("#sunit").text(declinate(seconds, "секунда", "секунды", "секунд"));
}, 500);
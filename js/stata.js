function refresh_stata(count = false){
    $.getJSON('https://cymonprojects.000webhostapp.com/crashprotect/main_page.json', function(data) {
        if(count){
            $('#servers').each(function () {
                var $this = $(this);
                jQuery({ Counter: Number($this.text)}).animate({ Counter: data["servers"] }, {
                  duration: 1000,
                  easing: 'swing',
                  step: function () {
                    var num = Math.ceil(this.Counter).toString();
                    if(Number(num) > 999){
                        while (/(\d+)(\d{3})/.test(num)) {
                            num = num.replace(/(\d+)(\d{3})/, '$1' + ' ' + '$2');
                        }
                    }
                    $this.text(num);
                  }
                });
              }); 
            $('#shards').each(function () {
              var $this = $(this);
              jQuery({ Counter: Number($this.text) }).animate({ Counter: data["shards"] }, {
                duration: 1000,
                easing: 'swing',
                step: function (now) {
                  $this.text(Math.ceil(now));
                }
              });
            });             
        }
        else{
            var num = data["servers"].toString();
            while (/(\d+)(\d{3})/.test(num)) {
              num = num.replace(/(\d+)(\d{3})/, '$1' + ' ' + '$2');
            }
            document.getElementById("servers").innerHTML = num;
            document.getElementById("shards").innerHTML = data["shards"];
        }
    });
}

var opened = false;

function menu(){
  if(!opened){
    document.getElementById("mm").style.display = "block";
    document.getElementById("menu").style.display = "none";
    opened = true;
  }
  else{
    document.getElementById("mm").style.display = "none";
    document.getElementById("menu").style.display = "";
    opened = false;
  }
}
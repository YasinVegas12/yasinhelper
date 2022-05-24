const googleTranslateConfig = {
    lang: "ru",
    assets: "/assets/frontend/upload/flags/",
    cookies: "GoogleTranslateCookie"
};

function TranslateInt() {

    var code = TranslateGetCode();

    $('.language__img').addClass('language__img_active');
    $('[data-google-text="imgs"]').attr('src', googleTranslateConfig.assets+code+'.png');

    if(code == googleTranslateConfig.lang) {
        TranslateClearCookie();
    } else {
        new google.translate.TranslateElement({
            pageLanguage: googleTranslateConfig.lang,
        });
    }

    var lang_list = $('li[data-google-lang]');
    $.each(lang_list, function(index, value) {
        var lang_code = $(value).attr('data-google-lang');
        if(lang_code == code) {
            $(value).remove();
        }
        // console.log(lang_code);
    });

    $('[data-google-lang]').click(function () {
        TranslateClearCookie();
        TranslateSetCookie($(this).attr("data-google-lang"));
        window.location.reload();
    });
}

function TranslateGetCode() {
    var cookies = $.cookie(googleTranslateConfig.cookies);
    if(cookies != undefined && cookies != "null" && cookies != "") {
        return cookies.substr(-2);
    } else {
        return googleTranslateConfig.lang;
    }
}

function TranslateClearCookie() {
    $.cookie(googleTranslateConfig.cookies, '');
    $.cookie(googleTranslateConfig.cookies, '', {
        domain: document.domain,
    });
}

function TranslateSetCookie(code) {
    $.cookie(googleTranslateConfig.cookies, "/auto/" + code);
    $.cookie(googleTranslateConfig.cookies, "/auto/" + code, {
        domain: "." + document.domain,
    });
}
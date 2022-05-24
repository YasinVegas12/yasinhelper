(function ($) {
	"use strict";
    jQuery(document).ready(function($){
        
        /*--------------------
            wow js init
        ---------------------*/
        new WOW().init();
        /*-------------------------
            magnific popup activation
        -------------------------*/
        $('.video-play-btn,.video-popup,.small-vide-play-btn').magnificPopup({
            type: 'video'
        });
    });
    //define variable for store last scrolltop
    var lastScrollTop = '';
    $(window).on('scroll', function () {
       /*--------------------------
        sticky menu activation
       -------------------------*/
        var st = $(this).scrollTop();
        var mainMenuTop = $('.navbar-area');
        if ($(window).scrollTop() > 1000) {
            if (st > lastScrollTop) {
                // hide sticky menu on scrolldown 
                mainMenuTop.removeClass('nav-fixed');
                
            } else {
                // active sticky menu on scrollup 
                mainMenuTop.addClass('nav-fixed');
            }

        } else {
            mainMenuTop.removeClass('nav-fixed ');
        }
        lastScrollTop = st;
       
    });
           
    $(window).on('load',function(){    
        var counternumber = $('.num-count');
        counternumber.counterUp({
            delay: 20,
            time: 500 
        });
    });

}(jQuery));	

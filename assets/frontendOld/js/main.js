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
        /*------------------
            back to top
        ------------------*/
        $(document).on('click', '.back-to-top', function () {
            $("html,body").animate({
                scrollTop: 0
            }, 2000);
        });
        /*-------------------------
            counter section activation
        ---------------------------*/
        // $(document).ready(function() {
        //     setTimeout(function() {
        //         var counternumber = $('.num-count');
        //         counternumber.counterUp({
        //             delay: 20,
        //             time: 500 
        //         });
        //     }, 250);
        // });
        
        /*---------------------------
            testimonial carousel
        ---------------------------*/
        var $tesitmonialCarousel = $('#testimonial-carousel');
        if ($tesitmonialCarousel.length > 0) {
            $tesitmonialCarousel.owlCarousel({
                loop: true,
                autoplay: true, //true if you want enable autoplay
                autoPlayTimeout: 1000,
                margin: 30,
                dots: false,
                nav: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 1
                    },
                    960: {
                        items: 1
                    },
                    1200: {
                        items: 1
                    },
                    1920: {
                        items: 1
                    }
                }
            });
        }
       

    });
    //define variable for store last scrolltop
    var lastScrollTop = '';
    $(window).on('scroll', function () {
        //back to top show/hide
       var ScrollTop = $('.back-to-top');
       if ($(window).scrollTop() > 1000) {
           ScrollTop.fadeIn(1000);
       } else {
           ScrollTop.fadeOut(1000);
       }
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
        /*-----------------
            preloader
        ------------------*/
        var preLoder = $("#preloader");
        preLoder.fadeOut(1000);
        /*-----------------
            back to top
        ------------------*/
        var backtoTop = $('.back-to-top')
        backtoTop.fadeOut(100);
        console.clear();
        
        var counternumber = $('.num-count');
        counternumber.counterUp({
            delay: 20,
            time: 500 
        });
    });

    $(document).on("click", ".faq_title", function(e) {
        $(this).toggleClass("expanded");
        $(this).next(".faq_desc").slideToggle();
    });

    function changeCapthaSize() {
        var reCaptchaWidth = 302;
        var containerWidth = $('.g-recaptcha').width(); 
        if(reCaptchaWidth > containerWidth) {
            var reCaptchaScale = containerWidth / reCaptchaWidth;
            $('.g-recaptcha').css({
                'transform':'scale('+reCaptchaScale+')',
                'transform-origin':'left top'
            });
        }                
    }
        
    $(document).ready(function() {
        changeCapthaSize();
    });
    $(document).resize(function() {
        changeCapthaSize();
    });

    //Activate bootstrip tooltips
    // $("[data-toggle='tooltip']").tooltip();

}(jQuery));	

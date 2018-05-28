$(document).ready(function() {

    //////////
    // FROM ETHNO
    //////////
    function getQueryParams(paramName) {
        var sURL = window.document.URL.toString();
        var value = [];
        if (sURL.indexOf("?") > 0) {
            var arrParams = sURL.split("?");
            var arrURLParams = arrParams[1].split("&");
            for (var i = 0; i < arrURLParams.length; i++) {
                var sParam = decodeURIComponent(arrURLParams[i]).split("=");
                if (sParam) {
                    if (sParam[0].split('[')[0] == paramName) {
                        if (sParam.length > 0) {
                            value.push(sParam[1].trim());
                        }
                    }
                }
            }
        }
        return value;
    };
    $(document).ready(function() {
        $(window).resize(function() {
            $('.single-slider, .single-slider-item').css('height', $('.single-slider').width());
        });
        $('.single-slider, .single-slider-item').css('height', $('.single-slider').width());
        if ($('[name="search"]').val() != '')
            $('[name="search"]').next().hide();
        else
            $('[name="search"]').next().show();

        $('[name="search"]').keyup(function() {
            if ($(this).val() != '')
                $(this).next().hide();
            else
                $(this).next().show();
        });

        $('.cs-country .cs-placeholder').text('Страны');
        $('.cs-services-all .cs-placeholder').text($('.cs-services-all').data('service'));
        $('.cs-select-socials .cs-placeholder').text('Связаться');

        if ($(window).width() < 1024)
            $('.main-news-item div p').each(function() {
                if ($(this).text().length > 85)
                    $(this).text($(this).text().substring(0, 80) + '...')
            });

        var servicesParam = getQueryParams('services');
        var countryParam = getQueryParams('country');

        $('.cs-services-all .cs-select').find('li').each(function(i) {
            if (servicesParam.indexOf($(this).data('value').toString()) !== -1) {
                $(this).addClass('active');
            }
        });
        console.log(countryParam);
        $('.cs-country .cs-select').find('li').each(function(i) {
            if (countryParam.indexOf($(this).data('value')) !== -1) {
                $(this).addClass('active');
            }
        });

        $('.cs-select li').click(function() {
            if ($(this).parent().parent().parent().parent().hasClass('cs-select-socials'))
                return true;
            var id = $(this).data('value');
            $(this).parent().parent().parent().addClass('cs-active');
            $(this).toggleClass('active');
            return false;
        });

        $(document).mouseup(function(e) {
            var containerservices = $('.cs-services-all .cs-select.cs-skin-slide');
            var containerCountry = $('.cs-country .cs-select.cs-skin-slide');
            var containerButton = $('.main-news-search .cs-select');
            if (!containerButton.is(e.target) && containerButton.has(e.target).length !== 0)
                return false;
            var countryVisible = ($('.cs-country .cs-skin-slide .cs-options').length && $('.cs-country .cs-skin-slide .cs-options').css('visibility') === 'visible') ? true : false;
            var servicesVisible = ($('.cs-services-all .cs-skin-slide .cs-options').length && $('.cs-services-all .cs-skin-slide .cs-options').css('visibility') === 'visible') ? true : false;
            console.log(servicesVisible, countryVisible);
            if (servicesVisible || countryVisible) {
                var location = window.location.href.replace(/&?(services%5B%5D)=([^&]$|[^&]*)/gi, "");
                $('.cs-services-all .cs-select .cs-options').find('li.active').each(function(i) {
                    if (i == 0 && location.indexOf('country') == -1 && location.indexOf('search') == -1)
                        location += '?services%5B%5D=' + $(this).data('value')
                    else
                        location += '&services%5B%5D=' + $(this).data('value')
                });
                var location = (typeof location !== 'undefined') ? location.replace(/&?(country%5B%5D)=([^&]$|[^&]*)/gi, "") : window.location.href.replace(/&?(country%5B%5D)=([^&]$|[^&]*)/gi, "");
                $('.cs-country .cs-select .cs-options').find('li.active').each(function(i) {
                    if (i == 0 && location.indexOf('services') == -1 && location.indexOf('search') == -1)
                        location += '?country%5B%5D=' + $(this).data('value')
                    else
                        location += '&country%5B%5D=' + $(this).data('value')
                });
                if (typeof location !== 'undefined')
                    window.location = location;
            }
        });

        $('.product-item-delete').click(function() {
            var _this = $(this);
            $.ajax({
                type: "POST",
                url: pref + "/wp-admin/admin-ajax.php?action=delete_from_trash",
                data: { 'post_id': _this.data('id') }
            }).done(function(data) {
                _this.parent().slideToggle();
                setTimeout(function() {
                    window.location = window.location.href;
                }, 500);
            });
        });

        $(document).on('click', '.service-item-price + span.add-order', function(event) {
            event.stopImmediatePropagation();
            var _this = $(this);
            $.ajax({
                type: "POST",
                url: pref + "/wp-admin/admin-ajax.php?action=add_cart",
                data: { 'post_id': _this.data('id'), 'post_count': _this.data('count') }
            }).done(function(data) {
                $('.header-cart span, .menu-cart span').text(data);
            });
            alert('Товар добавлен в заказ!');
            $(this).text('ДОБАВЛЕНО В ЗАКАЗ');
            return false;
        });

        $(document).on('click', '.load-more', function() {
            var _this = $(this);
            $(this).prev().prev().remove();
            var offset = $('.main-news-item').length;
            var data = (typeof window.location.href.split('?')[1] === 'undefined') ? 'page=' + _this.data('page') + '&offset=' + offset : window.location.href.split('?')[1] + '&page=' + _this.data('page') + '&offset=' + offset;
            if (_this.attr('data-cat').length != 0) data += '&cat=' + _this.attr('data-cat');
            if (_this.attr('data-categoryin').length != 0) data += '&categoryin=' + _this.attr('data-categoryin');
            if (_this.attr('data-country').length != 0) data += '&country=' + _this.attr('data-country');
            $.ajax({
                type: "GET",
                url: pref + "/wp-admin/admin-ajax.php?action=load_more",
                data: data
            }).done(function(data) {
                $('.main-news-item').last().after(data);
            });
            _this.attr('data-offset', $('.main-news-item').length);
            if (_this.attr('data-offset') >= $('.main-news-item').length)
                _this.hide();
            return false;
        });

        $('.single-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            nextArrow: '<div class="slick-next slick-arrow"><i class="fa fa-angle-right" aria-hidden="true"></i></div>',
            prevArrow: '<div class="slick-prev slick-arrow"><i class="fa fa-angle-left" aria-hidden="true"></i></div>',
        });
        $('.single-slider').each(function() {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
                }
            });
        });

        $('.toggle-menu').click(function() {
            $(this).toggleClass('active');
            $('.menu-mobile').slideToggle();
            $('header, body, html').toggleClass('active');
            setTimeout(function() {
                if ($('body').hasClass('active'))
                    $('body, html').css('height', $('.menu-mobile').height());
            }, 500);
            if (!$('body').hasClass('active')) {
                $('header, body, html').removeClass('active');
            }
        });

        var tempScrollTop, currentScrollTop = 0;
        var direction = 'down';
        var a = 0;
        var header_height = $('.main-slider').height();

        $(window).scroll(function() {
            if ($(window).width() < 1024) return;
            currentScrollTop = $(this).scrollTop();

            if (tempScrollTop < currentScrollTop) {
                if (direction == 'down') {
                    direction = 'up';
                    a = 0;
                } else {
                    a++;
                }
                if (a >= 10) {
                    $('.menu').removeClass('menu-fixed-show');
                }
            } else {
                if (direction == 'up') {
                    direction = 'down';
                    a = 0;
                } else {
                    a++;
                }
                if (a >= 10 && currentScrollTop > $('.main-slider').height()) {
                    $('.menu').addClass('menu-fixed-show');
                }
            }


            tempScrollTop = currentScrollTop;
        });

        $('.header-order, .popup-order, .menu-order, .filter').magnificPopup({
            type: 'inline',
            tClose: 'Закрыть'
        });

        $('.filter-right').magnificPopup({
            type: 'inline',
            tClose: 'Закрыть',
            callbacks: {
                elementParse: function(item) {
                    $('#filter-popup-countries .filter-popup-col').css('display', 'block');
                    console.log($(item.el[0]).data('type'));
                    $('#filter-popup-countries .filter-popup-col').eq(parseInt($(item.el[0]).data('type')) - 1).css('display', 'none');
                }
            }
        });

        var func = function() {
            var header_height = $('header').height();
            var top = $(this).scrollTop();

            if (header_height <= top) {
                $('.menu').addClass('menu-fixed');
                //$('.header-top').css('margin-bottom', '45px');
            } else {
                $('.menu').removeClass('menu-fixed');
                //$('.header-top').css('margin-bottom', '0px');
            }
        }
        $(window).scroll(func).resize(func);

        $('.subscribe input, .popup form input, .contacts-content form input, .contacts-content form textarea').on('change', function() {
            if ($(this).val() != "") {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });

        var width = $(window).width() / 2;
        var height = $(window).height() / 2;
        var offset = 20;

        /*$(document).mousemove(function( event ) {
          var top          = (( height - event.clientY ) / height)*offset;
          var left         = (( width - event.clientX ) / width)*offset;
          if ($(window).width() > 1024)
          $('.main-slider-item-img').css({
            '-webkit-transform' : 'translate3d(' + left + 'px, ' + top + 'px, 0)',  
            '-moz-transform' : 'translate3d(' + left + 'px, ' + top + 'px, 0)',
            '-ms-transform' : 'translate3d(' + left + 'px, ' + top + 'px, 0)',
            '-o-transform' : 'translate3d(' + left + 'px, ' + top + 'px, 0)',
            'transform' : 'translate3d(' + left + 'px, ' + top + 'px, 0)'
          });
        });  */

        $(".main-slider").slick({
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            autoplay: false,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            arrows: false,
            fade: true,
            speed: 2000,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    speed: 1000,
                }
            }]
        });

        $('.main-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            //alert(currentSlide);
            //$('.main-slider-item:eq(' + currentSlide + ') > div').addClass('main-slider-item-hide');
            //$('.main-slider-item:eq(' + nextSlide + ') > div').removeClass('main-slider-item-hide');
        });
        /*
        var range_value = '<span class="range-value"></span>';
    
        $('.popup-hours').rangeslider({
          polyfill: false,

          onInit: function() {
            $(this.$range).find('.rangeslider__handle').append(range_value);
            valueOutputHours(this.$element[0]);  
          },

          onSlide: function(position, value) {
            //console.log('onSlide');
            //console.log('position: ' + position, 'value: ' + value);
            valueOutputHours(this.$element[0]);
          },

          onSlideEnd: function(position, value) {
            //console.log('onSlideEnd');
            //console.log('position: ' + position, 'value: ' + value);
            valueOutputHours(this.$element[0]);
          }
        });
        */

        slider = document.getElementById('popup-range');

        noUiSlider.create(slider, {
            start: [1, 30],
            snap: true,
            connect: true,
            range: {
                'min': 1,
                '3.33%': 2,
                '6.66%': 3,
                '9.99%': 4,
                '13.32%': 5,
                '16.65%': 6,
                '19.98%': 7,
                '23.31%': 8,
                '26.64%': 9,
                '29.97%': 10,
                '33.3%': 11,
                '36.63%': 12,
                '39.96%': 13,
                '43.29%': 14,
                '46.62%': 15,
                '49.95%': 16,
                '53.28%': 17,
                '56.61%': 18,
                '59.94%': 19,
                '63.27%': 20,
                '66.6%': 21,
                '69.93%': 22,
                '73.26%': 23,
                '76.59%': 24,
                '79.92%': 25,
                '83.25%': 26,
                '86.58%': 27,
                '89.91%': 28,
                '93.24%': 29,
                'max': 30
            }
        });



        slider.noUiSlider.on('update', function(values) {
            valueOutputHours(values);
        });


        //Навигация по Landing Page
        //$(".top_mnu") - это верхняя панель со ссылками.
        //Ссылки вида <a href="#contacts">Контакты</a>
        $(".top_mnu").navigation();


        //Плавный скролл до блока .div по клику на .scroll
        //Документация: https://github.com/flesler/jquery.scrollTo
        $("a.scroll").click(function() {
            $.scrollTo($(".div"), 800, {
                offset: -90
            });
        });

        //Кнопка "Наверх"
        //Документация:
        //http://api.jquery.com/scrolltop/
        //http://api.jquery.com/animate/
        $("#top").click(function() {
            $("body, html").animate({
                scrollTop: 0
            }, 800);
            return false;
        });

    });

    function valueOutputHours(value) {
        //console.log(element);

        var valueL = value[0];
        switch (valueL) {
            case '1.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">09:00</div>');
                break;
            case '2.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">09:30</div>');
                break;
            case '3.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">10:00</div>');
                break;
            case '4.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">10:30</div>');
                break;
            case '5.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">11:00</div>');
                break;
            case '6.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">11:30</div>');
                break;
            case '7.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">12:00</div>');
                break;
            case '8.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">12:30</div>');
                break;
            case '9.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">13:00</div>');
                break;
            case '10.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">13:30</div>');
                break;
            case '11.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">14:00</div>');
                break;
            case '12.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">14:30</div>');
                break;
            case '13.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">15:00</div>');
                break;
            case '14.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">15:30</div>');
                break;
            case '15.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">16:00</div>');
                break;
            case '16.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">16:30</div>');
                break;
            case '17.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">17:00</div>');
                break;
            case '18.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">17:30</div>');
                break;
            case '19.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">18:00</div>');
                break;
            case '20.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">18:30</div>');
                break;
            case '21.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">19:00</div>');
                break;
            case '22.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">19:30</div>');
                break;
            case '23.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">20:00</div>');
                break;
            case '24.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">20:30</div>');
                break;
            case '25.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">21:00</div>');
                break;
            case '26.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">21:30</div>');
                break;
            case '27.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">22:00</div>');
                break;
            case '28.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">22:30</div>');
                break;
            case '29.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">23:00</div>');
                break;
            case '30.00':
                $('#popup-range .noUi-handle-lower').html('<div class="noUi-handle-lower-text">23:30</div>');
                break;
        }
        var valueU = value[1];
        switch (valueU) {
            case '1.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">09:00</div>');
                break;
            case '2.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">09:30</div>');
                break;
            case '3.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">10:00</div>');
                break;
            case '4.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">10:30</div>');
                break;
            case '5.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">11:00</div>');
                break;
            case '6.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">11:30</div>');
                break;
            case '7.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">12:00</div>');
                break;
            case '8.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">12:30</div>');
                break;
            case '9.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">13:00</div>');
                break;
            case '10.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">13:30</div>');
                break;
            case '11.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">14:00</div>');
                break;
            case '12.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">14:30</div>');
                break;
            case '13.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">15:00</div>');
                break;
            case '14.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">15:30</div>');
                break;
            case '15.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">16:00</div>');
                break;
            case '16.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">16:30</div>');
                break;
            case '17.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">17:00</div>');
                break;
            case '18.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">17:30</div>');
                break;
            case '19.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">18:00</div>');
                break;
            case '20.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">18:30</div>');
                break;
            case '21.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">19:00</div>');
                break;
            case '22.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">19:30</div>');
                break;
            case '23.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">20:00</div>');
                break;
            case '24.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">20:30</div>');
                break;
            case '25.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">21:00</div>');
                break;
            case '26.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">21:30</div>');
                break;
            case '27.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">22:00</div>');
                break;
            case '28.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">22:30</div>');
                break;
            case '29.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">23:00</div>');
                break;
            case '30.00':
                $('#popup-range .noUi-handle-upper').html('<div class="noUi-handle-upper-text">23:30</div>');
                break;
        }
    }
    //////////
    // FROM ETHNO
    //////////

    //////////
    // Global variables
    //////////

    var _window = $(window);
    var _document = $(document);

    ////////////
    // READY - triggered when PJAX DONE
    ////////////
    function pageReady() {
        legacySupport();
        updateHeaderActiveClass();
        initHeaderScroll();

        initPopups();
        initSliders();
        initScrollMonitor();
        initMasks();
        initSelectric();
        initValidations();

        // development helper
        _window.on('resize', debounce(setBreakpoint, 200))

        // AVAILABLE in _components folder
        // copy paste in main.js and initialize here
        // initPerfectScrollbar();
        // initLazyLoad();
        // initTeleport();
        // parseSvg();
        // revealFooter();
        // _window.on('resize', throttle(revealFooter, 100));
    }

    // this is a master function which should have all functionality
    pageReady();


    // some plugins work best with onload triggers
    _window.on('load', function() {
        // your functions
    })


    //////////
    // COMMON
    //////////

    function legacySupport() {
        // svg support for laggy browsers
        svg4everybody();

        // Viewport units buggyfill
        window.viewportUnitsBuggyfill.init({
            force: false,
            refreshDebounceWait: 150,
            appendToBody: true
        });
    }


    // Prevent # behavior
    _document
        .on('click', '[href="#"]', function(e) {
            e.preventDefault();
        })
        .on('click', 'a[href^="#section"]', function() { // section scroll
            var el = $(this).attr('href');
            $('body, html').animate({
                scrollTop: $(el).offset().top
            }, 1000);
            return false;
        })


    // HEADER SCROLL
    // add .header-static for .page or body
    // to disable sticky header
    function initHeaderScroll() {
        _window.on('scroll', throttle(function(e) {
            var vScroll = _window.scrollTop();
            var header = $('.header').not('.header--static');
            var headerHeight = header.height();
            var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
            var visibleWhen = Math.round(_document.height() / _window.height()) > 2.5

            if (visibleWhen) {
                if (vScroll > headerHeight) {
                    header.addClass('is-fixed');
                } else {
                    header.removeClass('is-fixed');
                }
                if (vScroll > firstSection) {
                    header.addClass('is-fixed-visible');
                } else {
                    header.removeClass('is-fixed-visible');
                }
            }
        }, 10));
    }


    // HAMBURGER TOGGLER
    _document.on('click', '[js-hamburger]', function() {
        $(this).toggleClass('is-active');
        $('.mobile-navi').toggleClass('is-active');
    });

    function closeMobileMenu() {
        $('[js-hamburger]').removeClass('is-active');
        $('.mobile-navi').removeClass('is-active');
    }

    // SET ACTIVE CLASS IN HEADER
    // * could be removed in production and server side rendering when header is inside barba-container
    function updateHeaderActiveClass() {
        $('.header__menu li').each(function(i, val) {
            if ($(val).find('a').attr('href') == window.location.pathname.split('/').pop()) {
                $(val).addClass('is-active');
            } else {
                $(val).removeClass('is-active')
            }
        });
    }

    //////////
    // SLIDERS
    //////////

    function initSliders() {

        // EXAMPLE SWIPER
        new Swiper('[js-slider]', {
            wrapperClass: "swiper-wrapper",
            slideClass: "example-slide",
            direction: 'horizontal',
            loop: false,
            watchOverflow: true,
            setWrapperSize: false,
            spaceBetween: 0,
            slidesPerView: 'auto',
            // loop: true,
            normalizeSlideIndex: true,
            // centeredSlides: true,
            freeMode: true,
            // effect: 'fade',
            autoplay: {
                delay: 5000,
            },
            navigation: {
                nextEl: '.example-next',
                prevEl: '.example-prev',
            },
            breakpoints: {
                // when window width is <= 992px
                992: {
                    autoHeight: true
                }
            }
        })

    }

    //////////
    // MODALS
    //////////

    function initPopups() {
        // Magnific Popup
        var startWindowScroll = 0;
        $('[js-popup]').magnificPopup({
            type: 'inline',
            fixedContentPos: true,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            mainClass: 'popup-buble',
            callbacks: {
                beforeOpen: function() {
                    startWindowScroll = _window.scrollTop();
                    // $('html').addClass('mfp-helper');
                },
                close: function() {
                    // $('html').removeClass('mfp-helper');
                    _window.scrollTop(startWindowScroll);
                }
            }
        });

        $('[js-popup-gallery]').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Загрузка #%curr%...',
            mainClass: 'popup-buble',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
            }
        });
    }

    function closeMfp() {
        $.magnificPopup.close();
    }

    ////////////
    // UI
    ////////////

    // textarea autoExpand
    _document
        .one('focus.autoExpand', '.ui-group textarea', function() {
            var savedValue = this.value;
            this.value = '';
            this.baseScrollHeight = this.scrollHeight;
            this.value = savedValue;
        })
        .on('input.autoExpand', '.ui-group textarea', function() {
            var minRows = this.getAttribute('data-min-rows') | 0,
                rows;
            this.rows = minRows;
            rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
            this.rows = minRows + rows;
        });

    // Masked input
    function initMasks() {
        $("[js-dateMask]").mask("99.99.99", { placeholder: "ДД.ММ.ГГ" });
        $("input[type='tel']").mask("+7 (000) 000-0000", { placeholder: "+7 (___) ___-____" });
    }

    // selectric
    function initSelectric() {
        $('select').selectric({
            maxHeight: 300,
            arrowButtonMarkup: '<b class="button"><svg class="ico ico-select-down"><use xlink:href="img/sprite.svg#ico-select-down"></use></svg></b>',

            onInit: function(element, data) {
                var $elm = $(element),
                    $wrapper = $elm.closest('.' + data.classes.wrapper);

                $wrapper.find('.label').html($elm.attr('placeholder'));
            },
            onBeforeOpen: function(element, data) {
                var $elm = $(element),
                    $wrapper = $elm.closest('.' + data.classes.wrapper);

                $wrapper.find('.label').data('value', $wrapper.find('.label').html()).html($elm.attr('placeholder'));
            },
            onBeforeClose: function(element, data) {
                var $elm = $(element),
                    $wrapper = $elm.closest('.' + data.classes.wrapper);

                $wrapper.find('.label').html($wrapper.find('.label').data('value'));
            }
        });
    }

    ////////////
    // SCROLLMONITOR - WOW LIKE
    ////////////
    function initScrollMonitor() {
        $('.wow').each(function(i, el) {

            var elWatcher = scrollMonitor.create($(el));

            var delay;
            if ($(window).width() < 768) {
                delay = 0
            } else {
                delay = $(el).data('animation-delay');
            }

            var animationClass = $(el).data('animation-class') || "wowFadeUp"

            var animationName = $(el).data('animation-name') || "wowFade"

            elWatcher.enterViewport(throttle(function() {
                $(el).addClass(animationClass);
                $(el).css({
                    'animation-name': animationName,
                    'animation-delay': delay,
                    'visibility': 'visible'
                });
            }, 100, {
                'leading': true
            }));
            // elWatcher.exitViewport(throttle(function() {
            //   $(el).removeClass(animationClass);
            //   $(el).css({
            //     'animation-name': 'none',
            //     'animation-delay': 0,
            //     'visibility': 'hidden'
            //   });
            // }, 100));
        });

    }

    ////////////////
    // FORM VALIDATIONS
    ////////////////

    // jQuery validate plugin
    // https://jqueryvalidation.org
    function initValidations() {
        // GENERIC FUNCTIONS
        var validateErrorPlacement = function(error, element) {
            error.addClass('ui-input__validation');
            error.appendTo(element.parent("div"));
        }
        var validateHighlight = function(element) {
            $(element).parent('div').addClass("has-error");
        }
        var validateUnhighlight = function(element) {
            $(element).parent('div').removeClass("has-error");
        }
        var validateSubmitHandler = function(form) {
            $(form).addClass('loading');
            $.ajax({
                type: "POST",
                url: $(form).attr('action'),
                data: $(form).serialize(),
                success: function(response) {
                    $(form).removeClass('loading');
                    var data = $.parseJSON(response);
                    if (data.status == 'success') {
                        // do something I can't test
                    } else {
                        $(form).find('[data-error]').html(data.message).show();
                    }
                }
            });
        }

        var validatePhone = {
            required: true,
            normalizer: function(value) {
                var PHONE_MASK = '+X (XXX) XXX-XXXX';
                if (!value || value === PHONE_MASK) {
                    return value;
                } else {
                    return value.replace(/[^\d]/g, '');
                }
            },
            minlength: 11,
            digits: true
        }

        ////////
        // FORMS


        /////////////////////
        // REGISTRATION FORM
        ////////////////////
        $(".js-registration-form").validate({
            errorPlacement: validateErrorPlacement,
            highlight: validateHighlight,
            unhighlight: validateUnhighlight,
            submitHandler: validateSubmitHandler,
            rules: {
                last_name: "required",
                first_name: "required",
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6,
                }
                // phone: validatePhone
            },
            messages: {
                last_name: "Заполните это поле",
                first_name: "Заполните это поле",
                email: {
                    required: "Заполните это поле",
                    email: "Email содержит неправильный формат"
                },
                password: {
                    required: "Заполните это поле",
                    email: "Пароль мимимум 6 символов"
                },
                // phone: {
                //     required: "Заполните это поле",
                //     minlength: "Введите корректный телефон"
                // }
            }
        });
    }


    //////////
    // BARBA PJAX
    //////////
    var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

    Barba.Pjax.Dom.containerClass = "page";

    var FadeTransition = Barba.BaseTransition.extend({
        start: function() {
            Promise
                .all([this.newContainerLoading, this.fadeOut()])
                .then(this.fadeIn.bind(this));
        },

        fadeOut: function() {
            var deferred = Barba.Utils.deferred();

            anime({
                targets: this.oldContainer,
                opacity: .5,
                easing: easingSwing, // swing
                duration: 300,
                complete: function(anim) {
                    deferred.resolve();
                }
            })

            return deferred.promise
        },

        fadeIn: function() {
            var _this = this;
            var $el = $(this.newContainer);

            $(this.oldContainer).hide();

            $el.css({
                visibility: 'visible',
                opacity: .5
            });

            anime({
                targets: "html, body",
                scrollTop: 1,
                easing: easingSwing, // swing
                duration: 150
            });

            anime({
                targets: this.newContainer,
                opacity: 1,
                easing: easingSwing, // swing
                duration: 300,
                complete: function(anim) {
                    triggerBody()
                    _this.done();
                }
            });
        }
    });

    // set barba transition
    Barba.Pjax.getTransition = function() {
        return FadeTransition;
    };

    Barba.Prefetch.init();
    Barba.Pjax.start();

    Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

        pageReady();
        closeMobileMenu();

    });

    // some plugins get bindings onNewPage only that way
    function triggerBody() {
        _window.scrollTop(0);
        $(window).scroll();
        $(window).resize();
    }

    //////////
    // MEDIA Condition helper function
    //////////
    function mediaCondition(cond) {
        var disabledBp;
        var conditionMedia = cond.substring(1);
        var conditionPosition = cond.substring(0, 1);

        if (conditionPosition === "<") {
            disabledBp = _window.width() < conditionMedia;
        } else if (conditionPosition === ">") {
            disabledBp = _window.width() > conditionMedia;
        }

        return disabledBp
    }

    //////////
    // DEVELOPMENT HELPER
    //////////
    function setBreakpoint() {
        var wHost = window.location.host.toLowerCase()
        var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
        if (displayCondition) {
            var wWidth = _window.width();

            var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

            $('.page').append(content);
            setTimeout(function() {
                $('.dev-bp-debug').fadeOut();
            }, 1000);
            setTimeout(function() {
                $('.dev-bp-debug').remove();
            }, 1500)
        }
    }

});
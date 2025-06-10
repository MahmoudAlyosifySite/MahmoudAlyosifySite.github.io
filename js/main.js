(function ($) {
    "use strict";

    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });


    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });


    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Scroll to Bottom
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll-to-bottom').fadeOut('slow');
        } else {
            $('.scroll-to-bottom').fadeIn('slow');
        }
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
            $('.back-to-top').removeClass('active');
        } else {
            $('.back-to-top').fadeOut('slow');
            $('.back-to-top').addClass('active');
        }
    });
    $('.back-to-top').click(function (event) {
        $('html, body').animate({scrollTop: $('#about').offset().top}, 500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        items: 1
    });
    
})(jQuery);

$(document).ready(function () {
    const certificateFiles = [
           "iti 1.JPG",
        "iti 2.JPG",
        "iti 3.JPG",
        "iti 4.JPG",
        "iti 5.JPG",
        "1678810507402.jpeg",
        "Annotation 2020-07-04 231855.jpg",
        "Annotation 2020-07-25 131550.jpg",
        "IMG_0340.JPG",  
        "IMG_0598.JPG",
        "IMG_0600.JPG",
        "IMG_1602.JPG",
        "IMG_2648.jpg",
        "IMG_3992.JPG",
        "IMG_3993.JPG",
        "IMG_3994.JPG",
        "IMG_3995.JPG",
        "IMG_4014.JPG",
        "IMG_4015.JPG",
        "IMG_4832.JPG",
        "IMG_4833.JPG",  
        "IMG_6131.JPG",
        "IMG_7887.JPG",
        "Screenshot 2025-02-13 023245.png",
        "Screenshot 2025-06-10 155852.png",
        "Screenshot 2025-06-10 160235.png",
         "IMG_0342.JPG",
            "IMG_5413.JPG",
            "IMG_9390.JPG"
    ];

    const container = $('#certGrid');

    certificateFiles.forEach((file, index) => {
        const html = `
            <div class="cert-col mb-4 px-2">
                <img class="img-fluid rounded w-100 mb-2" src="Certificates/${file}" alt="Certificate ${index + 1}">
                <h6 class="text-center">Certificate ${index + 1}</h6>
                <a class="btn btn-sm btn-outline-primary btn-block" href="Certificates/${file}" target="_blank">View Full</a>
            </div>
        `;
        container.append(html);
    });
});

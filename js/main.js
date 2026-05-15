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
    // Certificate data - Synchronized with CV exactly
    const certificates = [
        // AWS Academy Certifications
        { file: "IMG_4014.JPG", name: "AWS Academy Graduate — Data Engineering", issuer: "Amazon Web Services", year: "2026" },
        { file: "IMG_0340.JPG", name: "AWS Academy Graduate — Machine Learning for NLP", issuer: "Amazon Web Services", year: "2025" },
        { file: "IMG_4832.JPG", name: "AWS Academy Graduate — Machine Learning Foundations", issuer: "Amazon Web Services", year: "2025" },
        
        // Coursera Specializations
        { file: "Annotation 2020-07-04 231855.jpg", name: "Machine Learning Specialization", issuer: "Coursera / DeepLearning.AI", instructor: "Andrew Ng" },
        { file: "Annotation 2020-07-25 131550.jpg", name: "Mathematics for Machine Learning", issuer: "Coursera", year: "" },
        
        // Certification Credentials
        { file: "IMG_0600.JPG", name: "HCIP — AI (Huawei Certified ICT Professional)", issuer: "Huawei", year: "" },
        { file: "IMG_1602.JPG", name: "Microsoft Certified: Data Analyst Associate", issuer: "Microsoft", credential: "Power BI" },
        
        // Generative AI & AI Specialization
        { file: "IMG_2648.jpg", name: "Generative AI & Prompt Engineering Essentials", issuer: "IBM / Coursera", year: "" },
        { file: "IMG_3992.JPG", name: "Generative AI: Boost Your Cybersecurity Career", issuer: "IBM", year: "" },
        
        // NTI & Professional Training
        { file: "AI in Cybersecurity.png", name: "AI in Cybersecurity", issuer: "NTI", hours: "420 hours (Mar 2025 – Jul 2025)" },
        
        // Internships & Professional Development
        { file: "IMG_3993.JPG", name: "Machine Learning Internship", issuer: "ITIDA / Egypt Makes Electronics", hours: "200 hours (Jul – Sep 2023)" },
        { file: "IMG_3994.JPG", name: "Full Stack Development Diploma (.NET & Angular)", issuer: "Route Academy", duration: "May 2023 – Feb 2024" },
        
        // Data Analysis Training
        { file: "IMG_3995.JPG", name: "Data Analysis Training using R", issuer: "Children's Cancer Hospital Foundation 57357", year: "" },
        
        // ITI Technical Training Programs
        { file: "iti 1.JPG", name: ".NET Web Development", issuer: "ITI", hours: "120 hrs", details: "(ASP.NET MVC, Web API, Razor, Blazor, SignalR, Identity)" },
        { file: "iti 2.JPG", name: "SQL Server & C#", issuer: "ITI", hours: "90 hrs", details: "(DB design, stored procedures, LINQ, Entity Framework)" },
        { file: "iti 3.JPG", name: "MERN Stack Development", issuer: "ITI", hours: "60 hrs", details: "(MongoDB, Express.js, React.js, Node.js)" },
        { file: "iti 4.JPG", name: "UI/UX Design", issuer: "ITI", hours: "60 hrs", details: "(UX fundamentals, design process, prototyping)" },
        { file: "iti 5.JPG", name: "Android Mobile Development", issuer: "ITI", hours: "30 hrs", details: "(Android Studio, Java, XML)" }
    ];

    const container = $('#certGrid');

    certificates.forEach((cert) => {
        // Build info details dynamically
        let infoDetails = '';
        
        if (cert.hours) {
            infoDetails += `<p class="small text-muted mb-2"><i class="fas fa-clock mr-2"></i>${cert.hours}</p>`;
        }
        if (cert.year) {
            infoDetails += `<p class="small text-muted mb-2"><i class="fas fa-calendar mr-2"></i>${cert.year}</p>`;
        }
        if (cert.instructor) {
            infoDetails += `<p class="small text-muted mb-2"><i class="fas fa-user-tie mr-2"></i>${cert.instructor}</p>`;
        }
        if (cert.credential) {
            infoDetails += `<p class="small text-muted mb-2"><i class="fas fa-certificate mr-2"></i>${cert.credential}</p>`;
        }
        if (cert.duration) {
            infoDetails += `<p class="small text-muted mb-2"><i class="fas fa-hourglass mr-2"></i>${cert.duration}</p>`;
        }
        if (cert.details) {
            infoDetails += `<p class="small text-info mb-2" style="font-style: italic;">${cert.details}</p>`;
        }
        
        const html = `
            <div class="col-lg-4 col-md-6 mb-4 cert-card" style="transition: transform 0.3s ease;">
                <div class="cert-container h-100 border rounded-lg shadow-sm" style="transition: all 0.3s ease; cursor: pointer;" 
                     onmouseover="this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'; this.style.transform='translateY(-5px)';"
                     onmouseout="this.style.boxShadow=''; this.style.transform='translateY(0)';">
                    <div class="cert-image-wrapper overflow-hidden rounded-top" style="height: 250px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
                        <img class="img-fluid w-100 h-100" src="Certificates/${cert.file}" alt="${cert.name}" style="object-fit: cover; transition: transform 0.3s ease;" 
                             onmouseover="this.style.transform='scale(1.05)';"
                             onmouseout="this.style.transform='scale(1)';">
                    </div>
                    <div class="cert-info p-4">
                        <h6 class="font-weight-bold mb-2 text-primary">${cert.name}</h6>
                        <p class="small mb-2 text-muted">
                            <i class="fas fa-building mr-2"></i><strong>${cert.issuer}</strong>
                        </p>
                        ${infoDetails}
                        <a class="btn btn-sm btn-outline-primary w-100" href="Certificates/${cert.file}" target="_blank">
                            <i class="fas fa-expand mr-2"></i>View Certificate
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.append(html);
    });
});

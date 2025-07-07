$(document).ready(function () {
    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        
        var target = this.hash;
        var $target = $(target);

        // Smooth scroll to the target section
        $('html, body').animate({
            scrollTop: $target.offset().top
        }, 1000);
    });
});
$(document).ready(function () {
    // Bootstrap's mobile navbar toggle functionality
    $(".navbar-toggler").click(function () {
        $(".navbar-collapse").toggleClass("show");
    });
});

let lastScrollTop = 0;

window.addEventListener("scroll", function () {

    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        navbar.style.top = "-80px";
    } else {
        navbar.style.top = "0";
    }

    lastScrollTop = scrollTop;
});
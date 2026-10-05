// Site navigation: mobile menu toggle
(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.querySelector(".site-nav");
    const desktopQuery = window.matchMedia("(min-width: 64rem)");

    if (!navToggle || !siteNav) return;

    function setMenuOpen(isOpen) {
        navToggle.setAttribute("aria-expanded", String(isOpen));
        siteNav.classList.toggle("is-open", isOpen);
    }

    navToggle.addEventListener("click", function () {
        setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the mobile menu when a link is followed
    siteNav.addEventListener("click", function (event) {
        if (event.target.closest("a") && !desktopQuery.matches) setMenuOpen(false);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
            setMenuOpen(false);
            navToggle.focus();
        }
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".site-header")) setMenuOpen(false);
    });

    desktopQuery.addEventListener("change", function () {
        setMenuOpen(false);
    });
})();

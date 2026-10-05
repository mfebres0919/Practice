// Site navigation: mobile menu toggle + dropdown toggles
(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.querySelector(".site-nav");
    const dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
    const desktopQuery = window.matchMedia("(min-width: 75rem)");

    if (!navToggle || !siteNav) return;

    function setMenuOpen(isOpen) {
        navToggle.setAttribute("aria-expanded", String(isOpen));
        siteNav.classList.toggle("is-open", isOpen);
    }

    function closeDropdowns(except) {
        dropdownToggles.forEach(function (toggle) {
            if (toggle === except) return;
            toggle.setAttribute("aria-expanded", "false");
            toggle.closest(".nav-item").classList.remove("is-open");
        });
    }

    navToggle.addEventListener("click", function () {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
        if (isOpen) closeDropdowns();
    });

    // Sub-navigation stays collapsed until the parent is tapped/clicked
    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            const item = toggle.closest(".nav-item");
            const isOpen = toggle.getAttribute("aria-expanded") === "true";
            closeDropdowns(toggle);
            toggle.setAttribute("aria-expanded", String(!isOpen));
            item.classList.toggle("is-open", !isOpen);
        });
    });

    // Close the mobile menu when an in-page link is followed
    siteNav.addEventListener("click", function (event) {
        const link = event.target.closest("a[href^='#']");
        if (link && !desktopQuery.matches) setMenuOpen(false);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        const openToggle = document.querySelector(".nav-dropdown-toggle[aria-expanded='true']");
        closeDropdowns();
        if (openToggle) {
            openToggle.focus();
        } else if (siteNav.classList.contains("is-open")) {
            setMenuOpen(false);
            navToggle.focus();
        }
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".site-header")) {
            closeDropdowns();
            if (!desktopQuery.matches) setMenuOpen(false);
        }
    });

    desktopQuery.addEventListener("change", function () {
        setMenuOpen(false);
        closeDropdowns();
    });
})();

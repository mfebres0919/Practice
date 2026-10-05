// Hero slideshow: slow crossfade between images with a zoom in / zoom out effect
(function () {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const slides = hero.querySelectorAll(".hero-slide");
    const dots = hero.querySelectorAll(".hero-dot");
    const prevButton = hero.querySelector("[data-hero-prev]");
    const nextButton = hero.querySelector("[data-hero-next]");

    if (slides.length < 2) return;

    const styles = getComputedStyle(hero);
    const slideDuration = parseFloat(styles.getPropertyValue("--slide-duration")) * 1000;
    const fadeDuration = parseFloat(styles.getPropertyValue("--fade-duration")) * 1000;

    let current = 0;
    let timer = null;

    function startZoom(slide) {
        slide.classList.remove("is-zooming");
        void slide.offsetWidth; // restart the CSS animation
        slide.classList.add("is-zooming");
    }

    function goTo(index) {
        const next = (index + slides.length) % slides.length;
        if (next === current) return;

        const previous = slides[current];
        previous.classList.remove("is-active");
        window.setTimeout(function () {
            if (!previous.classList.contains("is-active")) previous.classList.remove("is-zooming");
        }, fadeDuration);

        slides[next].classList.add("is-active");
        startZoom(slides[next]);

        dots[current].classList.remove("is-active");
        dots[current].removeAttribute("aria-current");
        dots[next].classList.add("is-active");
        dots[next].setAttribute("aria-current", "true");

        current = next;
    }

    function play() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            goTo(current + 1);
        }, slideDuration);
    }

    function pause() {
        window.clearInterval(timer);
    }

    prevButton.addEventListener("click", function () {
        goTo(current - 1);
        play();
    });

    nextButton.addEventListener("click", function () {
        goTo(current + 1);
        play();
    });

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            goTo(index);
            play();
        });
    });

    // Don't cycle while someone is filling out the estimate form
    hero.addEventListener("focusin", function (event) {
        if (event.target.closest(".estimate-form")) pause();
    });
    hero.addEventListener("focusout", function (event) {
        if (!hero.contains(event.relatedTarget)) play();
    });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) pause();
        else play();
    });

    startZoom(slides[current]);
    play();
})();

// Service cards: on touch screens, a tap shows the same state as hovering on desktop
(function () {
    const cards = document.querySelectorAll(".service-card");
    const touchQuery = window.matchMedia("(hover: none)");

    if (!cards.length) return;

    function clearActive(except) {
        cards.forEach(function (card) {
            if (card !== except) card.classList.remove("is-active");
        });
    }

    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            if (!touchQuery.matches) return;
            clearActive(card);
            card.classList.toggle("is-active");
        });
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".service-card")) clearActive();
    });
})();

// Before & after gallery: drag-to-compare slider, category tabs, prev / next
(function () {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    const items = Array.from(gallery.querySelectorAll(".ba-item"));
    const tabs = gallery.querySelectorAll(".gallery-tab");
    const prevButton = gallery.querySelector("[data-gallery-prev]");
    const nextButton = gallery.querySelector("[data-gallery-next]");
    const currentLabel = gallery.querySelector("[data-gallery-current]");
    const totalLabel = gallery.querySelector("[data-gallery-total]");

    let visible = items;
    let current = 0;

    function setPosition(item, value) {
        const range = item.querySelector(".ba-range");
        range.value = value;
        item.querySelector(".ba-compare").style.setProperty("--pos", value + "%");
    }

    function show(index) {
        current = (index + visible.length) % visible.length;
        items.forEach(function (item) {
            item.classList.remove("is-active");
        });
        const item = visible[current];
        setPosition(item, 50);
        item.classList.add("is-active");

        currentLabel.textContent = current + 1;
        totalLabel.textContent = visible.length;
        prevButton.disabled = visible.length < 2;
        nextButton.disabled = visible.length < 2;
    }

    items.forEach(function (item) {
        const range = item.querySelector(".ba-range");
        range.addEventListener("input", function () {
            setPosition(item, range.value);
        });
    });

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const filter = tab.dataset.filter;
            tabs.forEach(function (other) {
                const isActive = other === tab;
                other.classList.toggle("is-active", isActive);
                other.setAttribute("aria-pressed", String(isActive));
            });
            visible = items.filter(function (item) {
                return filter === "all" || item.dataset.category === filter;
            });
            show(0);
        });
    });

    prevButton.addEventListener("click", function () {
        show(current - 1);
    });

    nextButton.addEventListener("click", function () {
        show(current + 1);
    });

    show(0);
})();

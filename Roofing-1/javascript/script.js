// Hero roof-transformation video
// Plays muted when motion is allowed, lingers on the finished roof before replaying,
// and falls back to the "after" photo if the video can't play.
(function () {
    const media = document.querySelector(".hero-media");
    const video = document.querySelector(".hero-video");
    const toggle = document.querySelector(".hero-video-toggle");
    const HOLD_ON_RESULT_MS = 2500;

    if (!media || !video || !toggle) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        media.classList.add("is-video-off");
        return;
    }

    let userPaused = false;
    let isVisible = true;
    let restartTimer;

    function showFallback() {
        clearTimeout(restartTimer);
        media.classList.add("is-video-off");
    }

    function playVideo() {
        const attempt = video.play();
        if (attempt) attempt.catch(showFallback);
    }

    function setPaused(paused) {
        userPaused = paused;
        toggle.classList.toggle("is-paused", paused);
        toggle.setAttribute("aria-label", (paused ? "Play" : "Pause") + " roof transformation video");

        if (paused) {
            clearTimeout(restartTimer);
            video.pause();
        } else if (isVisible) {
            playVideo();
        }
    }

    // Fires on the last <source> once no format could be loaded
    const sources = video.querySelectorAll("source");
    sources[sources.length - 1].addEventListener("error", showFallback);

    // Hold on the new roof for a moment, then replay
    video.addEventListener("ended", function () {
        restartTimer = setTimeout(function () {
            if (userPaused || !isVisible) return;
            video.currentTime = 0;
            playVideo();
        }, HOLD_ON_RESULT_MS);
    });

    toggle.addEventListener("click", function () {
        setPaused(!userPaused);
    });

    // Only play while the hero is on screen
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            isVisible = entries[0].isIntersecting;
            if (userPaused) return;
            if (isVisible) {
                if (video.ended) video.currentTime = 0;
                playVideo();
            } else {
                video.pause();
            }
        }).observe(media);
    } else {
        playVideo();
    }
})();

// Hero inspection form
// Demo handling only: shows a confirmation instead of sending. Swap in a real endpoint before launch.
(function () {
    const form = document.querySelector(".hero-form");
    if (!form) return;

    const status = form.querySelector(".hero-form-status");
    const nameInput = form.querySelector("#inspection-name");

    // "Book" buttons scroll to the form and put the cursor in the first field
    document.querySelectorAll('a[href="#inspection"]').forEach(function (link) {
        link.addEventListener("click", function () {
            setTimeout(function () {
                nameInput.focus({ preventScroll: true });
            }, 400);
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const firstName = nameInput.value.trim().split(" ")[0];
        status.textContent = "Thanks, " + firstName + "! We'll call you within one business day to schedule your inspection.";
        form.reset();
    });
})();

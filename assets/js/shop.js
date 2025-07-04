// hamburger menu icon
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const menuIcon = document.getElementById("menu-icon");

    toggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-times"); // switch icon
    });
});


// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Add your smooth scroll logic here
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// Lazy background loader
document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero-section");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    hero.classList.add("loaded");
                    observer.unobserve(hero);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(hero);
    } else {
        hero.classList.add("loaded"); // fallback
    }

    // Scroll-based animations
    const animateEls = document.querySelectorAll(".animate-fade-in, .animate-up");

    const animObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1 }
    );

    animateEls.forEach((el) => animObserver.observe(el));
});

    // Javascript for Scroll Reveal
    document.addEventListener("DOMContentLoaded", () => {
        const animatedEls = document.querySelectorAll(".animate-fade-in, .animate-up");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedEls.forEach(el => observer.observe(el));
    });

// Swiper Init
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1.2,
    spaceBetween: 20,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1.5,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 2.5,
        },
    },
});

// footer section

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-fade').forEach(el => observer.observe(el));

// Scroll to Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.onscroll = function () {
    scrollTopBtn.style.display = (document.documentElement.scrollTop > 300) ? "block" : "none";
};

scrollTopBtn.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Dynamic Year
document.getElementById("year").textContent = new Date().getFullYear();
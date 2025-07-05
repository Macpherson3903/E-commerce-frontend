import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Update footer year
    document.getElementById("year").textContent = new Date().getFullYear();

    // Hero section animations
    gsap.from(".hero-content", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power3.out"
    });

    gsap.from(".hero-icons i", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });

    gsap.to(".hero-icons i", {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none"
    });

    // Form section animation
    gsap.from(".contact-form-grid", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".contact-form",
            start: "top 80%"
        }
    });

    gsap.from(".form-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".contact-form",
            start: "top 80%"
        }
    });

    // Info section animation
    gsap.from(".info-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".info-grid",
            start: "top 80%"
        }
    });

    gsap.from(".info-item i", {
        scale: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".info-grid",
            start: "top 80%"
        }
    });

    // Map section animation
    gsap.from(".map-placeholder", {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: ".contact-map",
            start: "top 80%"
        }
    });

    // Particle animations for all sections
    document.querySelectorAll(".particle").forEach((particle, index) => {
        gsap.to(particle, {
            x: () => Math.random() * 100 - 50,
            y: () => Math.random() * 100 - 50,
            opacity: 0.2,
            duration: 5 + Math.random() * 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.5
        });
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });
});
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
    { id: 3, name: "Mark Miller", email: "mark@example.com", status: "active" }
];

const tableBody = document.getElementById("userTableBody");
const modal = document.getElementById("userModal");
const form = document.getElementById("userForm");
const menuToggle = document.querySelector(".menu-toggle");
const headerExtras = document.querySelector(".header-extras");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const languageToggle = document.querySelector(".language-toggle");
const languageSelector = document.querySelector(".language-selector");
const notificationBtn = document.querySelector(".notification-btn");
const settingsBtn = document.querySelector(".settings-btn");
const userProfile = document.querySelector(".user-profile");
const scrollTopBtn = document.querySelector(".scroll-top-btn");
const yearSpan = document.querySelector(".year");
const newsletterForm = document.querySelector(".footer-newsletter");

// Set current year in footer
yearSpan.textContent = new Date().getFullYear();

// Header Animations
gsap.from(".sticky-header", {
    y: -100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.2
});

gsap.from(".logo", {
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.4
});

gsap.from(".header-extras > *", {
    x: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.6
});

// Footer Animations
gsap.from(".footer-column", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".site-footer",
        start: "top 80%",
        toggleActions: "play none none none"
    }
});

gsap.from(".footer-bottom", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".footer-bottom",
        start: "top 90%",
        toggleActions: "play none none none"
    }
});

// Scroll to Top Button
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

ScrollTrigger.create({
    trigger: document.body,
    start: "top -200",
    end: "bottom bottom",
    onUpdate: (self) => {
        scrollTopBtn.classList.toggle("active", self.progress > 0.1);
    }
});

// Menu Toggle
menuToggle.addEventListener("click", () => {
    headerExtras.classList.toggle("active");
    gsap.to(headerExtras, {
        height: headerExtras.classList.contains("active") ? "auto" : 0,
        opacity: headerExtras.classList.contains("active") ? 1 : 0,
        duration: 0.3,
        ease: "power2.out"
    });
});

// Theme Toggle
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggleBtn.querySelector("i").classList.toggle("fa-moon", !isDark);
    themeToggleBtn.querySelector("i").classList.toggle("fa-sun", isDark);
    document.documentElement.style.setProperty("--background-color", isDark ? "#1c1c1c" : "#e5e5e5");
    document.documentElement.style.setProperty("--card-bg", isDark ? "#2c2c2c" : "#fff");
    document.documentElement.style.setProperty("--text-color", isDark ? "#ccc" : "#333");
});

// Language Selector
languageToggle.addEventListener("click", () => {
    languageSelector.classList.toggle("active");
});

document.querySelectorAll(".language-options li").forEach(item => {
    item.addEventListener("click", () => {
        const lang = item.getAttribute("data-lang");
        console.log(`Language selected: ${lang}`); // Replace with actual language switch logic
        languageSelector.classList.remove("active");
    });
});

// Profile Dropdown
userProfile.addEventListener("click", () => {
    userProfile.classList.toggle("active");
});

// Notification Button
notificationBtn.addEventListener("click", () => {
    console.log("Notifications opened"); // Replace with actual notification logic
});

// Settings Button
settingsBtn.addEventListener("click", () => {
    console.log("Settings opened"); // Replace with actual settings logic
});

// Newsletter Subscription
newsletterForm.querySelector("button").addEventListener("click", () => {
    const email = newsletterForm.querySelector("input").value;
    if (email) {
        console.log(`Subscribed with email: ${email}`); // Replace with actual subscription logic
        newsletterForm.querySelector("input").value = "";
    }
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
    if (!languageSelector.contains(e.target) && !languageToggle.contains(e.target)) {
        languageSelector.classList.remove("active");
    }
    if (!userProfile.contains(e.target)) {
        userProfile.classList.remove("active");
    }
});

// Table Rendering
function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>
                <button class="action-btn" onclick="openModal('view', ${user.id})"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="openModal('edit', ${user.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn" onclick="deleteUser(${user.id})"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    gsap.from("tr", {
        opacity: 0,
        y: 10,
        stagger: 0.1,
        duration: 0.3
    });
}

// Modal Functions
window.openModal = function (mode, id = null) {
    const title = document.getElementById("modalTitle");
    const userIdInput = document.getElementById("userId");
    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const statusInput = document.getElementById("userStatus");

    form.reset();
    userIdInput.value = "";

    if (mode === "add") {
        title.innerHTML = `<i class="fas fa-user-plus"></i> Add User`;
    } else {
        const user = users.find(u => u.id === id);
        if (!user) return;

        userIdInput.value = user.id;
        nameInput.value = user.name;
        emailInput.value = user.email;
        statusInput.value = user.status;

        title.innerHTML = `<i class="fas fa-user-${mode === "edit" ? "edit" : ""}"></i> ${mode === "edit" ? "Edit" : "View"} User`;
        if (mode === "view") {
            nameInput.disabled = true;
            emailInput.disabled = true;
            statusInput.disabled = true;
            document.querySelector(".save-user").style.display = "none";
        } else {
            nameInput.disabled = false;
            emailInput.disabled = false;
            statusInput.disabled = false;
            document.querySelector(".save-user").style.display = "block";
        }
    }

    modal.classList.add("active");
    gsap.from(".modal-content", {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
};

window.closeModal = function () {
    gsap.to(".modal-content", {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
            modal.classList.remove("active");
        }
    });
};

window.deleteUser = function (id) {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        renderTable(users);
    }
};

form.onsubmit = function (e) {
    e.preventDefault();
    const id = document.getElementById("userId").value;
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const status = document.getElementById("userStatus").value;

    if (id) {
        const user = users.find(u => u.id == id);
        user.name = name;
        user.email = email;
        user.status = status;
    } else {
        users.push({
            id: Date.now(),
            name,
            email,
            status
        });
    }

    renderTable(users);
    closeModal();
};

// Search & Sort
document.getElementById("searchInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const filtered = users.filter(u => u.name.toLowerCase().includes(value) || u.email.toLowerCase().includes(value));
    renderTable(filtered);
});

document.getElementById("sortSelect").addEventListener("change", function () {
    const val = this.value;
    if (val === "name") {
        users.sort((a, b) => a.name.localeCompare(b.name));
    } else if (val === "email") {
        users.sort((a, b) => a.email.localeCompare(b.email));
    }
    renderTable(users);
});

// Initial Render
renderTable(users);
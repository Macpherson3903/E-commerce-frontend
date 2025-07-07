import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Dummy data for sidebar content
    const dummyData = {
        dashboard: `
            <div class="welcome-container animate-fade">
                <h1>Welcome, John Doe!</h1>
                <p>Manage your account, track orders, and explore your wishlist.</p>
            </div>
            <div class="summary-container animate-fade">
                <div class="summary-card">
                    <i class="fas fa-wallet"></i>
                    <h3>Total Spent</h3>
                    <p>₦150,000</p>
                </div>
                <div class="summary-card">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Total Orders</h3>
                    <p>12</p>
                </div>
                <div class="summary-card">
                    <i class="fas fa-heart"></i>
                    <h3>Wishlist Items</h3>
                    <p>8</p>
                </div>
            </div>
        `,
        orders: `
            <h2>My Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#1001</td>
                        <td>2025-06-15</td>
                        <td>Construction Hammer</td>
                        <td>2</td>
                        <td>₦20,000</td>
                        <td>Delivered</td>
                    </tr>
                    <tr>
                        <td>#1002</td>
                        <td>2025-06-20</td>
                        <td>Power Drill</td>
                        <td>1</td>
                        <td>₦50,000</td>
                        <td>Shipped</td>
                    </tr>
                    <tr>
                        <td>#1003</td>
                        <td>2025-07-01</td>
                        <td>Safety Helmet</td>
                        <td>3</td>
                        <td>₦30,000</td>
                        <td>Pending</td>
                    </tr>
                </tbody>
            </table>
        `,
        wishlist: `
            <h2>Wishlist</h2>
            <div class="wishlist-grid">
                <div class="wishlist-item">
                    <h3>Power Drill</h3>
                    <p>₦50,000</p>
                    <button type="button" class="add-to-cart">Add to Cart</button>
                </div>
                <div class="wishlist-item">
                    <h3>Safety Helmet</h3>
                    <p>₦10,000</p>
                    <button type="button" class="add-to-cart">Add to Cart</button>
                </div>
                <div class="wishlist-item">
                    <h3>Toolbox</h3>
                    <p>₦25,000</p>
                    <button type="button" class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `,
        address: `
            <h2>Address Book</h2>
            <form class="address-form">
                <div class="form-group">
                    <label for="new-address">New Address</label>
                    <input type="text" id="new-address" placeholder="Enter new address" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="save-btn">Save Address</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
            <div class="address-list">
                <div class="address-item">
                    <p>123 Builder Lane, Lagos, Nigeria</p>
                    <p>Default Address</p>
                </div>
                <div class="address-item">
                    <p>456 Builder Road, Abuja, Nigeria</p>
                </div>
            </div>
        `,
        account: `
            <h2>Account Info</h2>
            <form class="account-form">
                <div class="form-group">
                    <label for="account-name">Full Name</label>
                    <input type="text" id="account-name" value="John Doe" required>
                </div>
                <div class="form-group">
                    <label for="account-email">Email</label>
                    <input type="email" id="account-email" value="john.doe@example.com" required>
                </div>
                <div class="form-group">
                    <label for="account-phone">Phone Number</label>
                    <input type="tel" id="account-phone" value="+234 812 345 6789" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="save-btn">Save Changes</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        `,
        password: `
            <h2>Change Password</h2>
            <form class="password-form">
                <div class="form-group">
                    <label for="current-password">Current Password</label>
                    <input type="password" id="current-password" placeholder="Enter current password" required>
                </div>
                <div class="form-group">
                    <label for="new-password">New Password</label>
                    <input type="password" id="new-password" placeholder="Enter new password" required>
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm New Password</label>
                    <input type="password" id="confirm-password" placeholder="Confirm new password" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="save-btn">Change Password</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        `,
        logout: `
            <div class="logout-container">
                <h2>Logout</h2>
                <p>Are you sure you want to log out of your account?</p>
                <button type="button" class="logout-btn">Log Out</button>
            </div>
        `
    };

    // Render content for the selected tab
    function renderContent(section) {
        const dynamicContent = document.querySelector(".dynamic-content");
        dynamicContent.innerHTML = dummyData[section] || `<h2>${section}</h2><p>Content for ${section} coming soon.</p>`;
        gsap.from(".dynamic-content", {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: "power3.out"
        });
    }

    // Initialize default tab
    renderContent("dashboard");

    // Header Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    const menuIcon = document.querySelector(".menu-icon");
    menuToggle.addEventListener("click", () => {
        navList.classList.toggle("active");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-times");
        gsap.fromTo(".nav-item",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    });

    // Sidebar Toggle
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        sidebarToggle.querySelector("i").classList.toggle("fa-angle-double-left");
        sidebarToggle.querySelector("i").classList.toggle("fa-angle-double-right");
        gsap.fromTo(".sidebar-item",
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
    });

    // Sidebar Navigation
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            const section = item.dataset.section;
            renderContent(section);
        });
    });

    // Theme Toggle
    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggleBtn.querySelector("i").classList.toggle("fa-moon");
        themeToggleBtn.querySelector("i").classList.toggle("fa-sun");
        gsap.to("body", { backgroundColor: document.body.classList.contains("dark-mode") ? "#1a1a1a" : "#e5e5e5", duration: 0.5 });
    });

    // Language Selector
    const languageToggle = document.querySelector(".language-toggle");
    const languageOptions = document.querySelector(".language-options");
    languageToggle.addEventListener("click", () => {
        languageOptions.parentElement.classList.toggle("active");
        gsap.fromTo(".language-options li",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" }
        );
    });
    languageOptions.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            const lang = option.dataset.lang;
            console.log(`Switch to language: ${lang}`); // Placeholder for translation
            languageOptions.parentElement.classList.remove("active");
        });
    });

    // Profile Dropdown
    const userProfile = document.querySelector(".user-profile");
    userProfile.addEventListener("click", () => {
        userProfile.classList.toggle("active");
        gsap.fromTo(".profile-dropdown li",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" }
        );
    });

    // Settings Modal
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsModal = document.querySelector(".settings-modal");
    const closeSettings = document.querySelector(".close-settings");
    const saveSettings = document.querySelector(".save-settings");
    const deleteAccountBtn = document.querySelector(".delete-account-btn");

    settingsBtn.addEventListener("click", () => {
        settingsModal.classList.add("active");
        gsap.fromTo(".settings-content",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    });

    closeSettings.addEventListener("click", () => {
        gsap.to(".settings-content", {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => settingsModal.classList.remove("active")
        });
    });

    saveSettings.addEventListener("click", () => {
        console.log("Save settings"); // Placeholder for form submission
        gsap.to(".settings-content", {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => settingsModal.classList.remove("active")
        });
    });

    deleteAccountBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete your account?")) {
            console.log("Delete account"); // Placeholder for deletion logic
        }
    });

    // Scroll to Top
    const scrollTopBtn = document.querySelector(".scroll-top-btn");
    window.addEventListener("scroll", () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Dynamic Year
    document.querySelector(".year").textContent = new Date().getFullYear();

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
        if (!languageToggle.contains(e.target) && !languageOptions.contains(e.target)) {
            languageOptions.parentElement.classList.remove("active");
        }
        if (!userProfile.contains(e.target)) {
            userProfile.classList.remove("active");
        }
    });
});
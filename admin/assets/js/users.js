import { gsap } from "gsap";

// Log script loading for debugging
console.log("users.js loaded");

// Google Analytics event tracking function
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    } else {
        console.warn("Google Analytics not loaded, event not tracked:", eventName, eventParams);
    }
}

// Mock user data (in production, move to shared module or backend)
const mockUsers = [
    { id: "USR001", name: "Alice Smith", email: "alice.smith@example.com", role: "admin", status: "active", lastLogin: "2025-07-08T09:00:00Z" },
    { id: "USR002", name: "Bob Johnson", email: "bob.johnson@example.com", role: "editor", status: "active", lastLogin: "2025-07-07T14:30:00Z" },
    { id: "USR003", name: "Carol White", email: "carol.white@example.com", role: "viewer", status: "inactive", lastLogin: "2025-06-30T10:15:00Z" },
    { id: "USR004", name: "David Brown", email: "david.brown@example.com", role: "admin", status: "active", lastLogin: "2025-07-06T16:45:00Z" },
    { id: "USR005", name: "Emma Davis", email: "emma.davis@example.com", role: "editor", status: "inactive", lastLogin: "2025-06-25T08:20:00Z" },
    { id: "USR006", name: "Frank Wilson", email: "frank.wilson@example.com", role: "viewer", status: "active", lastLogin: "2025-07-05T12:00:00Z" },
    { id: "USR007", name: "Grace Lee", email: "grace.lee@example.com", role: "admin", status: "active", lastLogin: "2025-07-04T09:30:00Z" },
    { id: "USR008", name: "Henry Taylor", email: "henry.taylor@example.com", role: "editor", status: "active", lastLogin: "2025-07-03T15:10:00Z" },
    { id: "USR009", name: "Isabella Martinez", email: "isabella.martinez@example.com", role: "viewer", status: "inactive", lastLogin: "2025-06-20T11:50:00Z" },
    { id: "USR010", name: "James Anderson", email: "james.anderson@example.com", role: "admin", status: "active", lastLogin: "2025-07-02T13:25:00Z" }
];

// Mock API for fetching users
async function fetchUsers() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockUsers]);
        }, 1000);
    });
}

// Download users as CSV
function downloadCSV(users) {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Last Login"];
    const csvRows = [
        headers.join(","),
        ...users.map(user =>
            `"${user.id}","${user.name}","${user.email}","${user.role}","${user.status}","${user.lastLogin}"`
        )
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Render users with pagination, sort, filter, and search
async function renderUsers(page = 1, sort = "name-asc", filterRole = "", filterStatus = "", search = "") {
    const userList = document.querySelector("#user-list");
    const noUsers = document.querySelector(".no-users");
    const pageInfo = document.querySelector("#page-info");
    const bulkActions = document.querySelector(".bulk-actions");
    const updateStatusBtn = document.querySelector(".update-status-btn");
    const selectAllCheckbox = document.querySelector("#select-all");
    if (!userList || !noUsers || !pageInfo || !bulkActions || !updateStatusBtn || !selectAllCheckbox) {
        console.error("Error: Required elements not found", {
            userList: !!userList,
            noUsers: !!noUsers,
            pageInfo: !!pageInfo,
            bulkActions: !!bulkActions,
            updateStatusBtn: !!updateStatusBtn,
            selectAllCheckbox: !!selectAllCheckbox
        });
        return { users: [], totalPages: 1 };
    }

    try {
        let users = await fetchUsers();
        console.log("Fetched users:", users.length);
        const itemsPerPage = 5;

        // Apply search
        if (search) {
            users = users.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply role filter
        if (filterRole) {
            users = users.filter(user => user.role === filterRole);
        }

        // Apply status filter
        if (filterStatus) {
            users = users.filter(user => user.status === filterStatus);
        }

        // Apply sort
        users.sort((a, b) => {
            if (sort === "name-asc") return a.name.localeCompare(b.name);
            if (sort === "name-desc") return b.name.localeCompare(a.name);
            if (sort === "last-login-desc") return new Date(b.lastLogin) - new Date(a.lastLogin);
            if (sort === "last-login-asc") return new Date(a.lastLogin) - new Date(b.lastLogin);
            return 0;
        });

        // Pagination
        const totalPages = Math.ceil(users.length / itemsPerPage) || 1;
        page = Math.min(page, totalPages);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedUsers = users.slice(start, end);

        // Update page info
        pageInfo.textContent = `Page ${page} of ${totalPages}`;

        // Enable/disable pagination buttons
        const firstBtn = document.querySelector("#first-page");
        const prevBtn = document.querySelector("#prev-page");
        const nextBtn = document.querySelector("#next-page");
        const lastBtn = document.querySelector("#last-page");
        if (firstBtn && prevBtn && nextBtn && lastBtn) {
            firstBtn.disabled = page === 1;
            prevBtn.disabled = page === 1;
            nextBtn.disabled = page === totalPages;
            lastBtn.disabled = page === totalPages;
        } else {
            console.error("Error: Pagination buttons not found");
        }

        // Reset select all checkbox
        selectAllCheckbox.checked = false;

        // Render users
        userList.innerHTML = "";
        if (paginatedUsers.length === 0) {
            noUsers.classList.add("active");
            bulkActions.style.display = "none";
            gsap.from(noUsers, { opacity: 0, duration: 0.5, ease: "power3.out" });
            return { users, totalPages };
        }

        noUsers.classList.remove("active");
        paginatedUsers.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="select-user" data-id="${user.id}" data-ga-event="select_user"></td>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-badge status-${user.status}">${user.status}</span></td>
                <td>${new Date(user.lastLogin).toLocaleString()}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${user.id}" data-ga-event="edit_user"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${user.id}" data-ga-event="delete_user"><i class="fas fa-trash"></i></button>
                </td>
            `;
            userList.appendChild(row);
            gsap.from(row, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
        });

        // Render mobile cards
        const mobileContainer = document.querySelector(".users-table");
        if (window.innerWidth <= 768) {
            mobileContainer.innerHTML = "";
            paginatedUsers.forEach((user, index) => {
                const card = document.createElement("div");
                card.classList.add("user-card");
                card.innerHTML = `
                    <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <div><input type="checkbox" class="select-user" data-id="${user.id}" data-ga-event="select_user"></div>
                    <div><strong>ID:</strong> ${user.id}</div>
                    <div><strong>Name:</strong> ${user.name}</div>
                    <div><strong>Email:</strong> ${user.email}</div>
                    <div><strong>Role:</strong> ${user.role}</div>
                    <div><strong>Status:</strong> <span class="status-badge status-${user.status}">${user.status}</span></div>
                    <div><strong>Last Login:</strong> ${new Date(user.lastLogin).toLocaleString()}</div>
                    <div class="actions">
                        <button class="action-btn edit-btn" data-id="${user.id}" data-ga-event="edit_user"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${user.id}" data-ga-event="delete_user"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                mobileContainer.appendChild(card);
                gsap.from(card, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
            });
        }

        // Update bulk actions visibility
        updateBulkActions();

        return { users, totalPages };
    } catch (error) {
        console.error("Error rendering users:", error);
        userList.innerHTML = "";
        noUsers.textContent = "Error loading users";
        noUsers.classList.add("active");
        bulkActions.style.display = "none";
        gsap.from(noUsers, { opacity: 0, duration: 0.5, ease: "power3.out" });
        return { users: [], totalPages: 1 };
    }
}

// Update bulk actions visibility and state
function updateBulkActions() {
    const bulkActions = document.querySelector(".bulk-actions");
    const updateStatusBtn = document.querySelector(".update-status-btn");
    const selectAllCheckbox = document.querySelector("#select-all");
    if (!bulkActions || !updateStatusBtn || !selectAllCheckbox) {
        console.error("Error: Bulk action elements not found");
        return;
    }

    const selectedCheckboxes = document.querySelectorAll(".select-user:checked");
    selectAllCheckbox.checked = selectedCheckboxes.length > 0 && selectedCheckboxes.length === document.querySelectorAll(".select-user").length;

    if (selectedCheckboxes.length > 0) {
        bulkActions.style.display = "flex";
        updateStatusBtn.disabled = !document.querySelector("#bulk-status").value;
        gsap.from(bulkActions, { opacity: 0, y: 10, duration: 0.3, ease: "power3.out" });
    } else {
        bulkActions.style.display = "none";
        updateStatusBtn.disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired for users.js");

    let currentPage = 1;
    let currentSort = "name-asc";
    let currentFilterRole = "";
    let currentFilterStatus = "";
    let currentSearch = "";
    let currentUsers = [];

    // Load initial users
    renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
        currentUsers = users;
    });

    // Search handler with debounce
    const searchInput = document.querySelector("#search");
    if (searchInput) {
        const debouncedSearch = debounce(() => {
            currentSearch = searchInput.value.trim();
            currentPage = 1;
            renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                currentUsers = users;
            });
            trackEvent("search_users", { query: currentSearch });
        }, 300);
        searchInput.addEventListener("input", debouncedSearch);
    } else {
        console.error("Error: #search not found");
    }

    // Sort handler
    const sortSelect = document.querySelector("#sort");
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            currentSort = sortSelect.value;
            currentPage = 1;
            renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                currentUsers = users;
            });
            trackEvent("sort_users", { sort: currentSort });
        });
    } else {
        console.error("Error: #sort not found");
    }

    // Role filter handler
    const filterRoleSelect = document.querySelector("#filter-role");
    if (filterRoleSelect) {
        filterRoleSelect.addEventListener("change", () => {
            currentFilterRole = filterRoleSelect.value;
            currentPage = 1;
            renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                currentUsers = users;
            });
            trackEvent("filter_role", { role: currentFilterRole });
        });
    } else {
        console.error("Error: #filter-role not found");
    }

    // Status filter handler
    const filterStatusSelect = document.querySelector("#filter-status");
    if (filterStatusSelect) {
        filterStatusSelect.addEventListener("change", () => {
            currentFilterStatus = filterStatusSelect.value;
            currentPage = 1;
            renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                currentUsers = users;
            });
            trackEvent("filter_status", { status: currentFilterStatus });
        });
    } else {
        console.error("Error: #filter-status not found");
    }

    // Export CSV handler
    const exportBtn = document.querySelector(".export-btn");
    if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
            if (confirm("Export current users to CSV?")) {
                let users = await fetchUsers();
                if (currentSearch) {
                    users = users.filter(user =>
                        user.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                        user.email.toLowerCase().includes(currentSearch.toLowerCase())
                    );
                }
                if (currentFilterRole) {
                    users = users.filter(user => user.role === currentFilterRole);
                }
                if (currentFilterStatus) {
                    users = users.filter(user => user.status === currentFilterStatus);
                }
                users.sort((a, b) => {
                    if (currentSort === "name-asc") return a.name.localeCompare(b.name);
                    if (currentSort === "name-desc") return b.name.localeCompare(a.name);
                    if (currentSort === "last-login-desc") return new Date(b.lastLogin) - new Date(a.lastLogin);
                    if (currentSort === "last-login-asc") return new Date(a.lastLogin) - new Date(b.lastLogin);
                    return 0;
                });
                downloadCSV(users);
                trackEvent("export_csv", { user_count: users.length });
            }
        });
    } else {
        console.error("Error: .export-btn not found");
    }

    // Add user handler (placeholder)
    const addUserBtn = document.querySelector(".add-user-btn");
    if (addUserBtn) {
        addUserBtn.addEventListener("click", () => {
            gsap.to(addUserBtn, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.in",
                onComplete: () => {
                    gsap.to(addUserBtn, { scale: 1, duration: 0.1 });
                    trackEvent("add_user");
                    alert("Navigating to Add User page (not yet implemented)");
                    // window.location.href = "add_user.html"; // Uncomment when page exists
                }
            });
        });
    } else {
        console.error("Error: .add-user-btn not found");
    }

    // Pagination handlers
    const firstBtn = document.querySelector("#first-page");
    const prevBtn = document.querySelector("#prev-page");
    const nextBtn = document.querySelector("#next-page");
    const lastBtn = document.querySelector("#last-page");
    if (firstBtn && prevBtn && nextBtn && lastBtn) {
        firstBtn.addEventListener("click", () => {
            if (currentPage !== 1) {
                currentPage = 1;
                renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                    currentUsers = users;
                });
                trackEvent("pagination_first");
            }
        });
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                    currentUsers = users;
                });
                trackEvent("pagination_prev");
            }
        });
        nextBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentUsers.length / 5);
            if (currentPage < totalPages) {
                currentPage++;
                renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                    currentUsers = users;
                });
                trackEvent("pagination_next");
            }
        });
        lastBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentUsers.length / 5);
            if (currentPage !== totalPages) {
                currentPage = totalPages;
                renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                    currentUsers = users;
                });
                trackEvent("pagination_last");
            }
        });
    } else {
        console.error("Error: Pagination buttons not found");
    }

    // Select all handler
    const selectAllCheckbox = document.querySelector("#select-all");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".select-user");
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            updateBulkActions();
            trackEvent("select_all_users", { checked: selectAllCheckbox.checked });
        });
    } else {
        console.error("Error: #select-all not found");
    }

    // Event delegation for dynamic elements
    document.querySelector(".users-table").addEventListener("click", (e) => {
        const editBtn = e.target.closest(".action-btn.edit-btn");
        const deleteBtn = e.target.closest(".action-btn.delete-btn");
        if (editBtn) {
            const id = editBtn.dataset.id;
            console.log(`Navigating to edit user for ID: ${id}`);
            gsap.to(editBtn, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.in",
                onComplete: () => {
                    gsap.to(editBtn, { scale: 1, duration: 0.1 });
                    trackEvent("edit_user", { user_id: id });
                    alert(`Navigating to edit user page for ${id} (not yet implemented)`);
                    // window.location.href = `edit_user.html?id=${id}`; // Uncomment when page exists
                }
            });
        } else if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            if (confirm(`Delete user ${id}?`)) {
                console.log(`Deleting user with ID: ${id}`);
                const index = mockUsers.findIndex(user => user.id === id);
                if (index !== -1) {
                    mockUsers.splice(index, 1);
                    renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch).then(({ users }) => {
                        currentUsers = users;
                    });
                    trackEvent("delete_user", { user_id: id });
                }
            }
        }
    });

    document.querySelector(".users-table").addEventListener("change", (e) => {
        if (e.target.classList.contains("select-user")) {
            updateBulkActions();
            trackEvent("select_user", { user_id: e.target.dataset.id, checked: e.target.checked });
        }
    });

    // Bulk status update handler
    const updateStatusBtn = document.querySelector(".update-status-btn");
    const bulkStatusSelect = document.querySelector("#bulk-status");
    if (updateStatusBtn && bulkStatusSelect) {
        bulkStatusSelect.addEventListener("change", () => {
            updateBulkActions();
            trackEvent("bulk_status_select", { status: bulkStatusSelect.value });
        });
        updateStatusBtn.addEventListener("click", async () => {
            const selectedCheckboxes = document.querySelectorAll(".select-user:checked");
            if (selectedCheckboxes.length === 0 || !bulkStatusSelect.value) return;
            if (confirm(`Update status of ${selectedCheckboxes.length} user(s) to ${bulkStatusSelect.value}?`)) {
                const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
                mockUsers.forEach(user => {
                    if (selectedIds.includes(user.id)) {
                        user.status = bulkStatusSelect.value;
                    }
                });
                const { users } = await renderUsers(currentPage, currentSort, currentFilterRole, currentFilterStatus, currentSearch);
                currentUsers = users;
                trackEvent("bulk_update_status", { status: bulkStatusSelect.value, user_ids: selectedIds });
                bulkStatusSelect.value = "";
                updateBulkActions();
            }
        });
    } else {
        console.error("Error: .update-status-btn or #bulk-status not found");
    }

    // Animate users card
    const usersCard = document.querySelector(".users-card");
    if (usersCard) {
        gsap.from(usersCard, {
            opacity: 0,
            y: 50,
            duration: 0.7,
            ease: "power3.out"
        });
    } else {
        console.error("Error: .users-card not found");
    }

    // Animate controls and table
    const controlsAndTable = document.querySelectorAll(".users-controls, .users-table, .pagination");
    if (controlsAndTable.length) {
        gsap.from(controlsAndTable, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
        });
    } else {
        console.error("Error: Users controls or table not found");
    }

    // Note: Status updates and deletions are stored in memory only. For persistence, integrate with a backend or localStorage.
});
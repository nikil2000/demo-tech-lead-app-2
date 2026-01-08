// ===================================
// ADMIN DASHBOARD - JAVASCRIPT
// SLT Telecom Platform
// ===================================

// === SCREEN NAVIGATION ===
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// === SESSION MANAGEMENT ===
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
let sessionTimeoutId = null;
let lastActivityTime = null;

/**
 * Initialize session tracking
 */
function initializeSession(user) {
    const loginTime = new Date().toISOString();
    sessionStorage.setItem('loginTime', loginTime);
    sessionStorage.setItem('lastActivity', loginTime);
    lastActivityTime = Date.now();

    // Start session timeout
    resetSessionTimeout();

    // Track user activity
    trackUserActivity();
}

/**
 * Reset session timeout
 */
function resetSessionTimeout() {
    // Clear existing timeout
    if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
    }

    // Set new timeout
    sessionTimeoutId = setTimeout(() => {
        handleSessionTimeout();
    }, SESSION_TIMEOUT);

    // Update last activity
    lastActivityTime = Date.now();
    sessionStorage.setItem('lastActivity', new Date().toISOString());
}

/**
 * Handle session timeout
 */
function handleSessionTimeout() {
    logSessionTimeout();
    showNotification('Session expired due to inactivity. Please login again.', 'info');

    setTimeout(() => {
        clearCurrentUser();
        showScreen('adminLoginScreen');
    }, 2000);
}

/**
 * Track user activity to reset timeout
 */
function trackUserActivity() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
        document.addEventListener(event, () => {
            if (getCurrentUser()) {
                resetSessionTimeout();
            }
        }, { passive: true });
    });
}

// === ADMIN LOGIN ===
function adminLogin(event) {
    event.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const role = document.getElementById('adminRole').value;

    // Validate all fields
    if (!username || !password || !role) {
        showNotification('Please fill in all fields including role selection', 'error');
        return false;
    }

    const button = event.target.querySelector('.btn-primary');
    button.innerHTML = '<span>Signing In...</span>';
    button.style.opacity = '0.7';

    // Authenticate against stored users
    setTimeout(() => {
        // Load all users from storage
        let allUsers = loadUsers();

        // Check if admin user exists
        const adminUser = allUsers.find(u => u.username === 'admin');

        // If admin user doesn't exist and trying to login as admin, create default admin
        if (!adminUser && username === 'admin' && password === 'admin123') {
            const defaultAdmin = {
                id: 'USER-ADMIN-001',
                username: 'admin',
                name: 'System Administrator',
                email: 'admin@slt.lk',
                password: 'admin123',
                defaultPassword: 'admin123',
                role: ROLES.SUPER_ADMIN,
                region: null,
                createdBy: 'SYSTEM',
                createdAt: new Date().toISOString()
            };
            addUser(defaultAdmin);
            allUsers = loadUsers(); // Reload after adding
            console.log('Default Super Admin created during login');
        }

        // Find user by username or email
        const user = allUsers.find(u =>
            (u.username === username || u.email === username) &&
            u.password === password &&
            u.role === role
        );

        if (!user) {
            // Authentication failed
            button.innerHTML = '<span>Sign In</span><div class="btn-shine"></div>';
            button.style.opacity = '1';

            // Provide helpful error message
            const userExists = allUsers.find(u => u.username === username || u.email === username);
            if (!userExists) {
                showNotification('Username not found. Please check your username.', 'error');
            } else if (userExists && userExists.password !== password) {
                showNotification('Incorrect password. Please try again.', 'error');
            } else if (userExists && userExists.role !== role) {
                showNotification(`Incorrect role. This user is a ${ROLE_NAMES[userExists.role]}.`, 'error');
            } else {
                showNotification('Invalid username, password, or role. Please try again.', 'error');
            }
            return false;
        }

        // Authentication successful
        // Store user in session
        setCurrentUser(user);

        // Initialize session management
        initializeSession(user);

        // Log login activity
        logLogin(user);

        // Update UI based on role
        updateUIForRole(user);

        // Show dashboard
        showScreen('adminDashboardScreen');

        // Hide Create New Job button initially (Overview section is default)
        const createJobBtn = document.getElementById('createJobBtn');
        if (createJobBtn) {
            createJobBtn.style.display = 'none';
        }

        // Reset button
        button.innerHTML = '<span>Sign In</span><div class="btn-shine"></div>';
        button.style.opacity = '1';

        // Show welcome message
        showNotification(`Welcome, ${user.name}!`, 'success');
    }, 1500);

    return false;
}

// === SECTION NAVIGATION ===
function showSection(sectionName) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.nav-link').classList.add('active');

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const sectionMap = {
        'overview': 'overviewSection',
        'jobs': 'jobsSection',
        'approval': 'approvalSection',
        'partners': 'partnersSection',
        'reports': 'reportsSection',
        'users': 'usersSection',
        'settings': 'settingsSection',
        'audit': 'auditSection'
    };

    const targetSection = document.getElementById(sectionMap[sectionName]);
    if (targetSection) {
        targetSection.classList.add('active');

        // If showing audit logs, populate them
        if (sectionName === 'audit') {
            displayAuditLogs();
        }

        // If showing user management, populate users
        if (sectionName === 'users') {
            displayUserManagement();
        }
    }

    // Update header
    const titles = {
        'overview': {
            title: 'Dashboard Overview',
            subtitle: 'Monitor and manage all tech-lead partner activities'
        },
        'jobs': {
            title: 'Job Management',
            subtitle: 'Create, assign, and track all jobs'
        },
        'approval': {
            title: 'Pending Approvals',
            subtitle: 'Review and approve completed jobs'
        },
        'partners': {
            title: 'Partner Management',
            subtitle: 'Manage tech-lead partner profiles and performance'
        },
        'reports': {
            title: 'Reports & Analytics',
            subtitle: 'View performance metrics and generate reports'
        },
        'users': {
            title: 'User Management',
            subtitle: 'Create and manage user accounts and roles'
        },
        'settings': {
            title: 'System Settings',
            subtitle: 'Configure regions, services, and system parameters'
        },
        'audit': {
            title: 'Audit Logs',
            subtitle: 'View all system activities and user actions'
        }
    };

    const titleInfo = titles[sectionName];
    document.getElementById('sectionTitle').textContent = titleInfo.title;
    document.getElementById('sectionSubtitle').textContent = titleInfo.subtitle;

    // Show/hide Create New Job button - only visible in Jobs section
    const createJobBtn = document.getElementById('createJobBtn');
    if (createJobBtn) {
        if (sectionName === 'jobs') {
            createJobBtn.style.display = 'flex';
        } else {
            createJobBtn.style.display = 'none';
        }
    }
}

// === JOB APPROVAL ===
function approveJob(jobId) {
    // Check permission
    if (!canAccess(PERMISSIONS.APPROVE_JOBS)) {
        logAccessDenied('Job Approval');
        showNotification('You do not have permission to approve jobs', 'error');
        return;
    }

    const button = event.target.closest('.btn-approve');
    const card = event.target.closest('.approval-card');

    button.innerHTML = '<span>Approving...</span>';
    button.style.opacity = '0.7';

    setTimeout(() => {
        // Log job approval
        logJobAction('approve', `JOB-2024-00${jobId}`, {
            approvedBy: getCurrentUser().name,
            timestamp: new Date().toISOString()
        });

        showNotification(`Job #JOB-2024-00${jobId} approved successfully!`, 'success');

        // Animate card removal
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';

        setTimeout(() => {
            card.remove();

            // Update pending count
            const badge = document.querySelector('.nav-link .badge');
            if (badge) {
                const currentCount = parseInt(badge.textContent);
                badge.textContent = Math.max(0, currentCount - 1);
            }

            // Update stats
            updateAdminStats();
        }, 300);
    }, 1000);
}

function rejectJob(jobId) {
    // Check permission
    if (!canAccess(PERMISSIONS.APPROVE_JOBS)) {
        logAccessDenied('Job Rejection');
        showNotification('You do not have permission to reject jobs', 'error');
        return;
    }

    const button = event.target.closest('.btn-reject');

    button.innerHTML = '<span>Opening rejection form...</span>';
    button.style.opacity = '0.7';

    setTimeout(() => {
        // Log job rejection
        logJobAction('reject', `JOB-2024-00${jobId}`, {
            rejectedBy: getCurrentUser().name,
            timestamp: new Date().toISOString(),
            reason: 'Pending user input' // In real app, would show modal for reason
        });

        showNotification(`Rejection form opened for Job #JOB-2024-00${jobId}`, 'info');
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Reject
        `;
        button.style.opacity = '1';
        // In real app, would open modal with rejection reason form
    }, 500);
}

// === CREATE JOB MODAL ===
function showCreateJobModal() {
    // Check permission
    if (!canAccess(PERMISSIONS.CREATE_JOBS)) {
        logAccessDenied('Job Creation');
        showNotification('You do not have permission to create jobs', 'error');
        return;
    }

    // Show modal
    const modal = document.getElementById('createJobModal');
    if (modal) {
        modal.classList.add('active');

        // Reset form
        document.getElementById('createJobForm').reset();

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('jobDeadline').min = today;
    }
}

/**
 * Close create job modal
 */
function closeCreateJobModal() {
    const modal = document.getElementById('createJobModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('createJobForm').reset();
    }
}

/**
 * Handle job creation form submission
 */
function handleCreateJob(event) {
    event.preventDefault();

    // Get form values
    const serviceType = document.getElementById('jobServiceType').value;
    const location = document.getElementById('jobLocation').value;
    const region = document.getElementById('jobRegion').value;
    const payment = document.getElementById('jobPayment').value;
    const deadline = document.getElementById('jobDeadline').value;
    const description = document.getElementById('jobDescription').value;

    // Generate job ID (in real app, would come from backend)
    const jobId = `JOB-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    // Format payment
    const formattedPayment = `LKR ${parseInt(payment).toLocaleString()}`;

    // Format deadline
    const deadlineDate = new Date(deadline);
    const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Create job object
    const newJob = {
        id: jobId,
        serviceType: serviceType,
        location: location,
        region: region,
        payment: formattedPayment,
        deadline: formattedDeadline,
        partner: 'Unassigned',
        description: description,
        status: 'assigned',
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUser().name
    };

    // Log job creation
    logJobAction('create', jobId, {
        serviceType,
        location,
        region,
        payment: formattedPayment,
        createdBy: getCurrentUser().name
    });

    // Add job to the table
    addJobToTable(newJob);

    // Close modal
    closeCreateJobModal();

    // Show success notification
    showNotification(`Job ${jobId} created successfully!`, 'success');

    // In real app, would save to backend and refresh job list
    console.log('New job created:', newJob);

    return false;
}

/**
 * Add a job to the jobs table
 */
function addJobToTable(job) {
    const tbody = document.querySelector('#jobsSection table tbody');
    if (!tbody) return;

    // Create new row
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><span class="job-id-link">#${job.id}</span></td>
        <td>${job.serviceType}</td>
        <td>${job.location}</td>
        <td>${job.partner}</td>
        <td><span class="status-badge status-assigned">Assigned</span></td>
        <td>${job.payment}</td>
        <td>
            <button class="btn-icon" title="View Details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        </td>
    `;

    // Add animation
    row.style.opacity = '0';
    row.style.transform = 'translateY(-10px)';

    // Insert at the top of the table
    tbody.insertBefore(row, tbody.firstChild);

    // Animate in
    setTimeout(() => {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 10);
}

// === STATS UPDATE ===
function updateAdminStats() {
    // Simulate stats update
    const completedStat = document.querySelector('.stat-green .stat-value-admin');
    if (completedStat) {
        const currentValue = parseInt(completedStat.textContent);
        animateValue(completedStat, currentValue + 1);
    }
}

function animateValue(element, newValue) {
    const currentValue = parseInt(element.textContent);
    const duration = 500;
    const steps = 20;
    const stepValue = (newValue - currentValue) / steps;
    let current = currentValue;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current += stepValue;
        element.textContent = Math.round(current);

        if (step >= steps) {
            element.textContent = newValue;
            clearInterval(timer);
        }
    }, duration / steps);
}

// === LOGOUT ===
function logout() {
    // Show custom logout confirmation modal instead of native confirm
    showLogoutConfirmation();
}

/**
 * Show logout confirmation modal
 */
function showLogoutConfirmation() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Close logout confirmation modal
 */
function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Confirm and execute logout
 */
function confirmLogout() {
    // Close modal first
    closeLogoutModal();

    // Log logout activity
    logLogout();

    // Clear session timeout
    if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
    }

    showNotification('Logging out...', 'info');

    setTimeout(() => {
        // Clear user session
        clearCurrentUser();

        // Return to login screen
        showScreen('adminLoginScreen');

        // Reset form
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminRole').value = '';
    }, 1000);
}

// === NOTIFICATIONS ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' :
            type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' :
                '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'}
            </svg>
            <span>${message}</span>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out, slideOutRight 0.3s ease-in 2.7s;
            max-width: 400px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-success {
            border-left: 4px solid #10B981;
        }
        
        .notification-success svg {
            color: #10B981;
        }
        
        .notification-error {
            border-left: 4px solid #EF4444;
        }
        
        .notification-error svg {
            color: #EF4444;
        }
        
        .notification-info {
            border-left: 4px solid #3B82F6;
        }
        
        .notification-info svg {
            color: #3B82F6;
        }
        
        .notification span {
            font-size: 0.9rem;
            color: #1F2937;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;

    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// === UI UPDATE BASED ON ROLE ===
function updateUIForRole(user) {
    const role = user.role;
    const roleName = ROLE_NAMES[role] || role;

    // Update profile display
    const profileName = document.getElementById('adminProfileName');
    const profileRole = document.getElementById('adminProfileRole');

    if (profileName) {
        profileName.textContent = user.name;
    }

    if (profileRole) {
        profileRole.textContent = roleName;
        // Add role-specific class
        profileRole.className = 'admin-role role-' + role.replace('_', '-');
    }

    // Hide/show navigation items based on permissions
    updateNavigationVisibility(role);

    // Update "Create Job" button visibility
    updateCreateJobButton(role);
}

/**
 * Update navigation visibility based on role
 */
function updateNavigationVisibility(role) {
    // User Management - Super Admin & Developer only
    const navUserManagement = document.getElementById('navUserManagement');
    if (navUserManagement) {
        navUserManagement.style.display = canAccess(PERMISSIONS.USER_MANAGEMENT) ? 'flex' : 'none';
    }

    // System Settings - Super Admin & Developer only
    const navSystemSettings = document.getElementById('navSystemSettings');
    if (navSystemSettings) {
        navSystemSettings.style.display = canAccess(PERMISSIONS.SYSTEM_SETTINGS) ? 'flex' : 'none';
    }

    // Audit Logs - Super Admin & Developer only
    const navAuditLogs = document.getElementById('navAuditLogs');
    if (navAuditLogs) {
        navAuditLogs.style.display = canAccess(PERMISSIONS.AUDIT_LOGS) ? 'flex' : 'none';
    }

    // Approvals - BST and Super Admin/Developer
    const navApprovals = document.querySelectorAll('.nav-link')[2]; // Approvals button
    if (navApprovals && !canAccess(PERMISSIONS.APPROVE_JOBS)) {
        navApprovals.style.display = 'none';
    }
}

/**
 * Update Create Job button visibility
 */
function updateCreateJobButton(role) {
    const createButton = document.querySelector('.btn-create');
    if (createButton) {
        // Tech-Lead Partners cannot create jobs
        if (role === ROLES.TECH_LEAD_PARTNER) {
            createButton.style.display = 'none';
        } else if (!canAccess(PERMISSIONS.CREATE_JOBS)) {
            createButton.style.display = 'none';
        } else {
            createButton.style.display = 'flex';
        }
    }
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Dashboard initialized');

    // Initialize default users if none exist
    initializeDefaultUsers();

    // Add smooth scroll
    document.documentElement.style.scrollBehavior = 'smooth';

    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User has active session
        updateUIForRole(currentUser);
        initializeSession(currentUser);
    }

    // Animate stats cards on load
    const statCards = document.querySelectorAll('.stat-card-admin');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 * index);
    });

    // Animate activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.opacity = '1';
        }, 100 * index);
    });
});

// === AUDIT LOG DISPLAY ===
function displayAuditLogs() {
    const container = document.getElementById('auditLogsList');
    if (!container) return;

    const logs = auditLogger.getRecentLogs(50);

    if (logs.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); padding: 20px; text-align: center;">No audit logs available</p>';
        return;
    }

    container.innerHTML = logs.map(log => {
        const message = auditLogger.getLogMessage(log);
        const typeClass = log.type.includes('login') ? 'activity-success' :
            log.type.includes('reject') || log.type.includes('denied') ? 'activity-warning' :
                'activity-info';

        return `
            <div class="activity-item">
                <div class="activity-icon ${typeClass}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div class="activity-content">
                    <p class="activity-title">${log.type.replace(/_/g, ' ').toUpperCase()}</p>
                    <p class="activity-meta">${message}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Export audit logs
 */
function exportAuditLogs() {
    if (!canAccess(PERMISSIONS.AUDIT_LOGS)) {
        showNotification('You do not have permission to export audit logs', 'error');
        return;
    }

    const logsJson = auditLogger.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Audit logs exported successfully', 'success');
}

/**
 * Show create user modal with role-based permissions
 */
function showCreateUserModal() {
    if (!canAccess(PERMISSIONS.USER_MANAGEMENT)) {
        logAccessDenied('User Creation');
        showNotification('You do not have permission to create users', 'error');
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Session expired. Please login again.', 'error');
        return;
    }

    // Get roles that current user can create
    const creatableRoles = getCreatableRoles(currentUser.role);

    if (creatableRoles.length === 0) {
        showNotification('You do not have permission to create any user roles', 'error');
        return;
    }

    // Populate role dropdown with allowed roles
    const roleSelect = document.getElementById('newUserRole');
    roleSelect.innerHTML = '<option value="">Select role...</option>';

    creatableRoles.forEach(roleId => {
        const option = document.createElement('option');
        option.value = roleId;
        option.textContent = ROLE_NAMES[roleId];
        roleSelect.appendChild(option);
    });

    // Show/hide region field based on role selection
    roleSelect.addEventListener('change', function () {
        const regionGroup = document.getElementById('regionGroup');
        const regionSelect = document.getElementById('newUserRegion');

        if (this.value === ROLES.REGIONAL_MANAGER ||
            this.value === ROLES.TECH_LEAD_PARTNER ||
            this.value === ROLES.BUSINESS_SUPPORT) {
            regionGroup.style.display = 'block';
            regionSelect.required = true;
        } else {
            regionGroup.style.display = 'none';
            regionSelect.required = false;
            regionSelect.value = '';
        }
    });

    // Show modal
    const modal = document.getElementById('createUserModal');
    modal.classList.add('active');

    // Reset form
    document.getElementById('createUserForm').reset();
    document.getElementById('regionGroup').style.display = 'none';
}

/**
 * Close create user modal
 */
function closeCreateUserModal() {
    const modal = document.getElementById('createUserModal');
    modal.classList.remove('active');
    document.getElementById('createUserForm').reset();
}

// === USER STORAGE FUNCTIONS ===

/**
 * Save users array to localStorage
 * @param {array} users - Array of user objects
 */
function saveUsers(users) {
    try {
        localStorage.setItem('platformUsers', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
}

/**
 * Load users from localStorage
 * @returns {array} Array of user objects
 */
function loadUsers() {
    try {
        const usersJson = localStorage.getItem('platformUsers');
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

/**
 * Get all users from storage
 * @returns {array} Array of all users
 */
function getAllUsers() {
    return loadUsers();
}

/**
 * Add new user to storage
 * @param {object} user - User object to add
 * @returns {boolean} Success status
 */
function addUser(user) {
    const users = loadUsers();
    users.push(user);
    const saved = saveUsers(users);

    if (saved) {
        console.log('User added successfully:', user);
    }

    return saved;
}

/**
 * Update existing user in storage
 * @param {string} userId - User ID to update
 * @param {object} updates - Object with fields to update
 * @returns {boolean} Success status
 */
function updateUser(userId, updates) {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        console.error('User not found:', userId);
        return false;
    }

    // Merge updates
    users[userIndex] = { ...users[userIndex], ...updates };
    const saved = saveUsers(users);

    if (saved) {
        console.log('User updated successfully:', userId);
    }

    return saved;
}

/**
 * Delete user from storage
 * @param {string} userId - User ID to delete
 * @returns {boolean} Success status
 */
function deleteUser(userId) {
    const users = loadUsers();
    const filteredUsers = users.filter(u => u.id !== userId);

    if (filteredUsers.length === users.length) {
        console.error('User not found:', userId);
        return false;
    }

    const saved = saveUsers(filteredUsers);

    if (saved) {
        console.log('User deleted successfully:', userId);
    }

    return saved;
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {object|null} User object or null
 */
function getUserById(userId) {
    const users = loadUsers();
    return users.find(u => u.id === userId) || null;
}

/**
 * Filter users based on current user's role visibility
 * @param {string} currentUserRole - Current user's role
 * @returns {array} Filtered array of users
 */
function getVisibleUsers(currentUserRole) {
    const allUsers = loadUsers();
    const visibleRoles = getVisibleRoles(currentUserRole);

    return allUsers.filter(user => visibleRoles.includes(user.role));
}

/**
 * Sort users by role hierarchy
 * @param {array} users - Array of users to sort
 * @returns {array} Sorted array of users
 */
function sortUsersByHierarchy(users) {
    return users.sort((a, b) => {
        const hierarchyA = getRoleHierarchy(a.role);
        const hierarchyB = getRoleHierarchy(b.role);
        return hierarchyA - hierarchyB;
    });
}

/**
 * Initialize default users if none exist
 */
function initializeDefaultUsers() {
    const users = loadUsers();

    // Check if admin user exists
    const adminExists = users.some(u => u.username === 'admin');

    if (!adminExists) {
        // Create default Super Admin with specified credentials
        const defaultAdmin = {
            id: 'USER-ADMIN-001',
            username: 'admin',
            name: 'System Administrator',
            email: 'admin@slt.lk',
            password: 'admin123', // In production, this should be hashed
            defaultPassword: 'admin123',
            role: ROLES.SUPER_ADMIN,
            region: null,
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        };

        addUser(defaultAdmin);
        console.log('Default Super Admin created - Username: admin, Password: admin123');
    }
}

// === USER MANAGEMENT DISPLAY ===

/**
 * Generate avatar with initials and color
 * @param {string} name - User's full name
 * @param {string} role - User's role (for color)
 * @returns {string} HTML for avatar
 */
function generateAvatar(name, role) {
    // Get initials
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    // Color based on role
    const roleColors = {
        [ROLES.SUPER_ADMIN]: '#8B5CF6',      // Purple
        [ROLES.DEVELOPER]: '#3B82F6',        // Blue
        [ROLES.REGIONAL_MANAGER]: '#10B981', // Green
        [ROLES.BUSINESS_SUPPORT]: '#F59E0B', // Orange
        [ROLES.TECH_LEAD_PARTNER]: '#6366F1' // Indigo
    };

    const bgColor = roleColors[role] || '#6B7280';

    return `
        <div class="user-avatar" style="background: ${bgColor};">
            ${initials}
        </div>
    `;
}

/**
 * Create user card HTML
 * @param {object} user - User object
 * @param {object} currentUser - Current logged-in user
 * @returns {string} HTML for user card
 */
function createUserCard(user, currentUser) {
    const roleName = ROLE_NAMES[user.role] || user.role;
    const canEdit = canEditUser(currentUser.role, user.role, user.id, currentUser.id);
    const canDelete = canDeleteUser(currentUser.role, user.role, user.id, currentUser.id);

    return `
        <div class="user-card" data-user-id="${user.id}">
            ${generateAvatar(user.name, user.role)}
            <div class="user-info">
                <h3 class="user-name">${user.name}</h3>
                <p class="user-role">${roleName}</p>
                ${user.region ? `<p class="user-region">${user.region}</p>` : ''}
                <p class="user-email">${user.email}</p>
            </div>
            <button class="btn-view-profile" onclick="viewProfile('${user.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Profile
            </button>
        </div>
    `;
}

/**
 * Display user management interface
 */
function displayUserManagement() {
    const container = document.getElementById('usersGrid');
    if (!container) {
        console.error('Users grid container not found');
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
        container.innerHTML = '<p style="color: var(--gray); padding: 20px; text-align: center;">Please login to view users</p>';
        return;
    }

    // Get visible users based on current user's role
    let users = getVisibleUsers(currentUser.role);

    // Sort by hierarchy
    users = sortUsersByHierarchy(users);

    if (users.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); padding: 20px; text-align: center;">No users to display</p>';
        return;
    }

    // Generate user cards
    container.innerHTML = users.map(user => createUserCard(user, currentUser)).join('');
}

// === USER SEARCH & FILTER ===

let currentSearchTerm = '';
let currentRoleFilter = '';

/**
 * Search users by ID, name, or email
 */
function searchUsers(searchTerm) {
    currentSearchTerm = searchTerm.toLowerCase();
    applyFilters();
}

/**
 * Filter users by role
 */
function filterByRole(role) {
    currentRoleFilter = role;
    applyFilters();
}

/**
 * Apply search and filter to user list
 */
function applyFilters() {
    const container = document.getElementById('usersGrid');
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Get visible users based on role
    let users = getVisibleUsers(currentUser.role);

    // Apply role filter
    if (currentRoleFilter) {
        users = users.filter(user => user.role === currentRoleFilter);
    }

    // Apply search filter
    if (currentSearchTerm) {
        users = users.filter(user =>
            user.id.toLowerCase().includes(currentSearchTerm) ||
            user.name.toLowerCase().includes(currentSearchTerm) ||
            user.email.toLowerCase().includes(currentSearchTerm)
        );
    }

    // Sort by hierarchy
    users = sortUsersByHierarchy(users);

    if (users.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); padding: 20px; text-align: center;">No users found matching your search</p>';
        return;
    }

    // Generate user cards
    container.innerHTML = users.map(user => createUserCard(user, currentUser)).join('');
}

/**
 * Clear all filters
 */
function clearFilters() {
    currentSearchTerm = '';
    currentRoleFilter = '';

    const searchInput = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');

    if (searchInput) searchInput.value = '';
    if (roleFilter) roleFilter.value = '';

    displayUserManagement();
}

/**
 * Handle user creation form submission
 */
function handleCreateUser(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();
    const username = document.getElementById('newUserUsername').value;
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const region = document.getElementById('newUserRegion').value;

    // Check if username already exists
    const allUsers = loadUsers();
    const usernameExists = allUsers.some(u => u.username === username);
    if (usernameExists) {
        showNotification('Username already exists. Please choose a different username.', 'error');
        return false;
    }

    // Validate that current user can create this role
    if (!canCreateRole(currentUser.role, role)) {
        showNotification('You do not have permission to create this role', 'error');
        return false;
    }

    // Validate region for Regional Managers, Tech Lead Partners, and Business Support Team
    if ((role === ROLES.REGIONAL_MANAGER ||
        role === ROLES.TECH_LEAD_PARTNER ||
        role === ROLES.BUSINESS_SUPPORT) && !region) {
        showNotification('Please select a region', 'error');
        return false;
    }

    // Create user object (in real app, would send to backend)
    const newUser = {
        id: 'USER-' + Date.now(),
        username: username,
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        defaultPassword: password, // Store default password for reset
        role: role,
        region: region || null,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString()
    };

    // Log the user creation
    logUserAction('create', newUser.id, {
        name: newUser.name,
        email: newUser.email,
        role: ROLE_NAMES[newUser.role],
        region: newUser.region
    });

    // Save user to storage
    const saved = addUser(newUser);

    if (!saved) {
        showNotification('Error saving user. Please try again.', 'error');
        return false;
    }

    // Show success message
    showNotification(`User "${name}" created successfully as ${ROLE_NAMES[role]}`, 'success');

    // Close modal
    closeCreateUserModal();

    // Refresh user list display
    displayUserManagement();

    return false;
}

// === PROFILE MANAGEMENT ===

let currentViewingUserId = null;

/**
 * View user profile in modal
 */
function viewProfile(userId) {
    const user = getUserById(userId);
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }

    const currentUser = getCurrentUser();
    currentViewingUserId = userId;

    // Populate modal
    const roleName = ROLE_NAMES[user.role] || user.role;
    document.getElementById('profileAvatar').innerHTML = generateAvatar(user.name, user.role);
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileRole').textContent = roleName;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileUserId').textContent = user.id;

    const regionRow = document.getElementById('profileRegionRow');
    if (user.region) {
        regionRow.style.display = 'flex';
        document.getElementById('profileRegion').textContent = user.region;
    } else {
        regionRow.style.display = 'none';
    }

    const createdDate = new Date(user.createdAt).toLocaleDateString();
    document.getElementById('profileCreatedAt').textContent = createdDate;

    // Check permissions
    const canEdit = canEditUser(currentUser.role, user.role, user.id, currentUser.id);
    const canDelete = canDeleteUser(currentUser.role, user.role, user.id, currentUser.id);

    document.getElementById('btnEditProfile').style.display = canEdit ? 'flex' : 'none';
    document.getElementById('btnDeleteProfile').style.display = canDelete ? 'flex' : 'none';

    document.getElementById('viewProfileModal').classList.add('active');
}

function closeProfileModal() {
    document.getElementById('viewProfileModal').classList.remove('active');
    currentViewingUserId = null;
}

function editProfile() {
    const userId = currentViewingUserId; // Save ID
    const user = getUserById(userId);
    if (!user) return;

    closeProfileModal();
    currentViewingUserId = userId; // Restore ID because closeProfileModal clears it

    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserRole').value = user.role;
    document.getElementById('editUserRole').disabled = true;

    const editRegionGroup = document.getElementById('editRegionGroup');
    if (user.role === ROLES.REGIONAL_MANAGER) {
        editRegionGroup.style.display = 'block';
        document.getElementById('editUserRegion').value = user.region || '';
    } else {
        editRegionGroup.style.display = 'none';
    }

    document.getElementById('editProfileModal').classList.add('active');
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.remove('active');
    document.getElementById('editProfileForm').reset();
}

function handleEditProfile(event) {
    event.preventDefault();

    const updates = {
        name: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        region: document.getElementById('editUserRegion').value || null
    };

    if (updateUser(currentViewingUserId, updates)) {
        logUserAction('update', currentViewingUserId, updates);
        showNotification('User profile updated successfully', 'success');
        closeEditProfileModal();
        displayUserManagement();
        currentViewingUserId = null;
    } else {
        showNotification('Error updating user profile', 'error');
    }

    return false;
}

function confirmDeleteUser() {
    const userId = currentViewingUserId; // Save ID
    const user = getUserById(userId);
    if (!user) return;

    closeProfileModal();
    currentViewingUserId = userId; // Restore ID because closeProfileModal clears it

    document.getElementById('deleteUserName').textContent = user.name;
    document.getElementById('deleteUserModal').classList.add('active');
}

function closeDeleteUserModal() {
    document.getElementById('deleteUserModal').classList.remove('active');
}

function deleteUserAccount() {
    const user = getUserById(currentViewingUserId);
    if (!user) return;

    logUserAction('delete', currentViewingUserId, {
        name: user.name,
        email: user.email,
        role: ROLE_NAMES[user.role]
    });

    if (deleteUser(currentViewingUserId)) {
        showNotification(`User "${user.name}" deleted successfully`, 'success');
        closeDeleteUserModal();
        displayUserManagement();
        currentViewingUserId = null;
    } else {
        showNotification('Error deleting user', 'error');
    }
}

// === PASSWORD MANAGEMENT ===

/**
 * Show password reset confirmation
 */
function confirmResetPassword() {
    const userId = currentViewingUserId; // Save ID
    const user = getUserById(userId);
    if (!user) return;

    closeProfileModal();
    currentViewingUserId = userId; // Restore ID because closeProfileModal clears it

    document.getElementById('resetPasswordUserName').textContent = user.name;
    document.getElementById('resetPasswordModal').classList.add('active');
}

/**
 * Close password reset modal
 */
function closeResetPasswordModal() {
    document.getElementById('resetPasswordModal').classList.remove('active');
}

/**
 * Reset user password to default
 */
function resetUserPassword() {
    const user = getUserById(currentViewingUserId);
    if (!user) return;

    if (!user.defaultPassword) {
        showNotification('No default password set for this user', 'error');
        closeResetPasswordModal();
        return;
    }

    // Reset password to default
    const updates = {
        password: user.defaultPassword
    };

    if (updateUser(currentViewingUserId, updates)) {
        logUserAction('password_reset', currentViewingUserId, {
            name: user.name,
            email: user.email
        });

        showNotification(`Password reset successfully for ${user.name}`, 'success');
        closeResetPasswordModal();
        currentViewingUserId = null;
    } else {
        showNotification('Error resetting password', 'error');
    }
}

// === PROTOTYPE HELPERS ===
function simulateAdminData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                stats: {
                    totalJobs: 156,
                    pending: 5,
                    completed: 124,
                    activePartners: 42
                },
                recentActivity: [
                    { type: 'approval', job: 'JOB-2024-045', time: '5 minutes ago' },
                    { type: 'created', job: 'JOB-2024-046', time: '15 minutes ago' },
                    { type: 'issue', job: 'JOB-2024-042', time: '1 hour ago' }
                ]
            });
        }, 500);
    });
}

// Export functions
window.adminLogin = adminLogin;
window.showSection = showSection;
window.approveJob = approveJob;
window.rejectJob = rejectJob;
window.showCreateJobModal = showCreateJobModal;
window.logout = logout;
window.showLogoutConfirmation = showLogoutConfirmation;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.displayAuditLogs = displayAuditLogs;
window.exportAuditLogs = exportAuditLogs;
window.showCreateUserModal = showCreateUserModal;
window.closeCreateUserModal = closeCreateUserModal;
window.handleCreateUser = handleCreateUser;
window.searchUsers = searchUsers;
window.filterByRole = filterByRole;
window.clearFilters = clearFilters;
window.viewProfile = viewProfile;
window.closeProfileModal = closeProfileModal;
window.editProfile = editProfile;
window.closeEditProfileModal = closeEditProfileModal;
window.handleEditProfile = handleEditProfile;
window.confirmDeleteUser = confirmDeleteUser;
window.closeDeleteUserModal = closeDeleteUserModal;
window.deleteUserAccount = deleteUserAccount;
window.confirmResetPassword = confirmResetPassword;
window.closeResetPasswordModal = closeResetPasswordModal;
window.resetUserPassword = resetUserPassword;

// === BACK TO ROLE SELECTION ===
function backToRoleSelection() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to return to role selection? You will be logged out.');

    if (!confirmed) {
        return;
    }

    // Clear current user session
    clearCurrentUser();

    // Navigate to index.html (role selection page)
    window.location.href = 'index.html';
}

// === LOGOUT ===
function logout() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?');

    if (!confirmed) {
        return;
    }

    // Log logout activity
    logLogout();

    // Clear current user session
    clearCurrentUser();

    // Show notification
    showNotification('Logging out...', 'info');

    // Return to login screen after a short delay
    setTimeout(() => {
        showScreen('adminLoginScreen');

        // Reset login form
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminRole').value = '';
    }, 1000);
}

// Make functions globally accessible
window.backToRoleSelection = backToRoleSelection;
window.logout = logout;

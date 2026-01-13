// ===================================
// ADMIN DASHBOARD - JAVASCRIPT
// SLT Telecom Platform
// ===================================

// === SHARED JOB STORAGE ===
/**
 * Save jobs to localStorage
 */
function saveJobsToStorage(jobs) {
    try {
        localStorage.setItem('platformJobs', JSON.stringify(jobs));
    } catch (error) {
        console.error('Error saving jobs to storage:', error);
    }
}

/**
 * Load jobs from localStorage
 */
function loadJobsFromStorage() {
    try {
        const jobsJson = localStorage.getItem('platformJobs');
        return jobsJson ? JSON.parse(jobsJson) : [];
    } catch (error) {
        console.error('Error loading jobs from storage:', error);
        return [];
    }
}

// === SECTION NAVIGATION ===
/**
 * Show a specific section and hide others
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the target section
    const targetSection = document.getElementById(`${sectionId}Section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.nav-link')?.classList.add('active');

    // Show/hide Create New Job button based on section
    const createJobBtn = document.getElementById('createJobBtn');
    if (createJobBtn) {
        createJobBtn.style.display = (sectionId === 'jobs') ? 'block' : 'none';
    }

    // Load jobs when Jobs section is shown
    if (sectionId === 'jobs') {
        displayJobs();
    }
}

/**
 * Display jobs from localStorage in the jobs table
 */
function displayJobs() {
    const tbody = document.querySelector('#jobsSection table tbody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    // Load jobs from storage
    const jobs = loadJobsFromStorage();

    // If no jobs, show a message
    if (jobs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">
                    No jobs created yet. Click "Create New Job" to get started.
                </td>
            </tr>
        `;
        return;
    }

    // Add each job to the table
    jobs.forEach(job => {
        addJobToTable(job);
    });
}

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

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Role:', role);

    // Validate all fields
    if (!username || !password || !role) {
        console.error('Validation failed: Missing fields');
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
        console.log('Total users in storage:', allUsers.length);
        console.log('All users:', allUsers);

        // Check if admin user exists
        const adminUser = allUsers.find(u => u.username === 'admin');
        console.log('Admin user exists?', !!adminUser);

        // If admin user doesn't exist and trying to login as admin, create default admin
        if (!adminUser && username === 'admin' && password === 'admin123') {
            console.log('Creating default admin user...');
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
            console.log('Default admin object:', defaultAdmin);
            console.log('ROLES.SUPER_ADMIN value:', ROLES.SUPER_ADMIN);
            addUser(defaultAdmin);
            allUsers = loadUsers(); // Reload after adding
            console.log('Default Super Admin created during login');
            console.log('Users after creation:', allUsers);
        }

        // Find user by username or email
        console.log('Searching for user with:');
        console.log('  - username or email:', username);
        console.log('  - password:', password);
        console.log('  - role:', role);

        const user = allUsers.find(u =>
            (u.username === username || u.email === username) &&
            u.password === password &&
            u.role === role
        );

        console.log('User found?', !!user);
        if (user) {
            console.log('Matched user:', user);
        }

        if (!user) {
            // Authentication failed
            console.error('=== AUTHENTICATION FAILED ===');
            button.innerHTML = '<span>Sign In</span><div class="btn-shine"></div>';
            button.style.opacity = '1';

            // Provide helpful error message
            const userExists = allUsers.find(u => u.username === username || u.email === username);
            console.log('User exists (by username/email)?', !!userExists);

            if (!userExists) {
                console.error('Error: Username not found');
                showNotification('Username not found. Please check your username.', 'error');
            } else if (userExists && userExists.password !== password) {
                console.error('Error: Password mismatch');
                console.log('Expected password:', userExists.password);
                console.log('Provided password:', password);
                showNotification('Incorrect password. Please try again.', 'error');
            } else if (userExists && userExists.role !== role) {
                console.error('Error: Role mismatch');
                console.log('User role:', userExists.role);
                console.log('Selected role:', role);
                console.log('ROLE_NAMES:', ROLE_NAMES);
                showNotification(`Incorrect role. This user is a ${ROLE_NAMES[userExists.role]}.`, 'error');
            } else {
                console.error('Error: Unknown authentication failure');
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

        // IF APPROVAL SECTION: Load Pending Jobs
        if (sectionName === 'approval') {
            displayPendingApprovals();
        }

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

// === APPROVAL LOGIC ===
function displayPendingApprovals() {
    const jobs = loadJobsFromStorage();
    const pendingJobs = jobs.filter(j => j.status === 'pending_approval');

    const container = document.querySelector('.approval-grid');
    if (!container) return;

    container.innerHTML = '';

    if (pendingJobs.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray);">No pending approvals found.</p>';
        return;
    }

    pendingJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'approval-card';
        card.innerHTML = `
            <div class="approval-header">
                <div>
                    <h4>${job.serviceType}</h4>
                    <span class="job-id-sm">${job.id}</span>
                </div>
                <span class="status-badge status-pending">Pending Review</span>
            </div>
            
            <div class="approval-body">
                <div class="approval-info">
                    <p><strong>Partner:</strong> ${job.partner}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Submitted:</strong> ${new Date(job.submittedAt || Date.now()).toLocaleDateString()}</p>
                </div>
                
                <div class="proof-preview" style="margin: 12px 0;">
                     <p style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">Proof of Work:</p>
                     ${job.proofImage ?
                `<img src="${job.proofImage}" onclick="openImageModal('${job.proofImage}')" 
                        style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 1px solid var(--light-gray);">`
                : '<p style="color: var(--status-rejected); font-size: 0.8rem;">No image uploaded</p>'}
                </div>
                
                <div class="approval-actions">
                    <button class="btn-approve" onclick="approveJob('${job.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Approve
                    </button>
                    <button class="btn-reject" onclick="rejectJob('${job.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Reject
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Simple Image Modal (can be improved)
function openImageModal(src) {
    const win = window.open("", "Proof Preview", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600");
    if (win) {
        win.document.body.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f0f0;"><img src="${src}" style="max-width:100%;max-height:100%;"></div>`;
    }
}

function approveJob(jobId) {
    console.log('Approve job called with ID:', jobId);

    // Check permission
    if (!canAccess(PERMISSIONS.APPROVE_JOBS)) {
        logAccessDenied('Job Approval');
        showNotification('You do not have permission to approve jobs', 'error');
        return;
    }

    // Update Storage
    let jobs = loadJobsFromStorage();

    // Find job by ID (handle both string and number IDs)
    let job = jobs.find(j => j.id == jobId || j.id === jobId);

    if (job) {
        console.log('Job found, approving:', job);
        job.status = 'completed';
        job.approvedBy = getCurrentUser().name;
        job.approvedAt = new Date().toISOString();
        saveJobsToStorage(jobs);

        // Log action
        logJobAction('approve', jobId, { approvedBy: getCurrentUser().name });

        showNotification(`Job ${jobId} approved successfully!`, 'success');

        // Refresh List
        displayPendingApprovals();

        // Update Stats (Optional: reload stats)
        updateAdminStats();
    } else {
        console.error('Job not found with ID:', jobId);
        showNotification('Job not found', 'error');
    }
}

function rejectJob(jobId) {
    console.log('Reject job called with ID:', jobId);

    // Check permission
    if (!canAccess(PERMISSIONS.APPROVE_JOBS)) {
        logAccessDenied('Job Rejection');
        showNotification('You do not have permission to reject jobs', 'error');
        return;
    }

    const reason = prompt("Please enter the reason for rejection:");
    if (!reason) return;

    // Update Storage
    let jobs = loadJobsFromStorage();

    // Find job by ID (handle both string and number IDs)
    let job = jobs.find(j => j.id == jobId || j.id === jobId);

    if (job) {
        console.log('Job found, rejecting with reason:', reason);
        job.status = 'in_progress'; // Send back to in_progress
        job.rejectionReason = reason;
        job.rejectedBy = getCurrentUser().name;
        job.rejectedAt = new Date().toISOString();
        saveJobsToStorage(jobs);

        // Log action
        logJobAction('reject', jobId, { rejectedBy: getCurrentUser().name, reason: reason });

        showNotification(`Job ${jobId} rejected.`, 'info');

        // Refresh List
        displayPendingApprovals();

        // Update Stats
        updateAdminStats();
    } else {
        console.error('Job not found with ID:', jobId);
        showNotification('Job not found', 'error');
    }
}

// === CREATE JOB MODAL ===
/**
 * Load tech lead partners into the assignment dropdown
 */
function loadTechLeadPartnersForModal() {
    const dropdown = document.getElementById('partnerAssignmentDropdown');
    if (!dropdown) return;

    // Get all users from localStorage
    const usersJson = localStorage.getItem('platformUsers');
    const allUsers = usersJson ? JSON.parse(usersJson) : [];

    // Filter for tech lead partners only
    const techLeadPartners = allUsers.filter(u => u.role === 'tech_lead_partner');

    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Select Tech Lead Partner</option>';

    // Add tech lead partners to dropdown
    if (techLeadPartners.length === 0) {
        dropdown.innerHTML += '<option value="" disabled>No tech lead partners available</option>';
    } else {
        techLeadPartners.forEach(partner => {
            const option = document.createElement('option');
            option.value = partner.name;
            option.textContent = `${partner.name} (${partner.nvq || partner.id})`;
            dropdown.appendChild(option);
        });
    }
}

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

        // Load tech lead partners into dropdown
        loadTechLeadPartnersForModal();
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
    const partner = document.getElementById('partnerAssignmentDropdown').value;

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
        partner: partner,
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

    // Load existing jobs from storage
    const existingJobs = loadJobsFromStorage();

    // Add new job to the array
    existingJobs.push(newJob);

    // Save updated jobs back to storage
    saveJobsToStorage(existingJobs);

    // Add job to the table
    addJobToTable(newJob);

    // Close modal
    closeCreateJobModal();

    // Show success notification
    showNotification(`Job ${jobId} created successfully and assigned to ${partner}!`, 'success');

    // In real app, would save to backend and refresh job list
    console.log('New job created and saved to storage:', newJob);

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

// === MY PROFILE MANAGEMENT ===
let currentProfilePhoto = null; // Store the selected photo temporarily

/**
 * Show My Profile modal
 */
function showMyProfile() {
    const user = getCurrentUser();
    if (!user) {
        showNotification('No user logged in', 'error');
        return;
    }

    // Populate view mode
    document.getElementById('myProfileName').textContent = user.name;
    document.getElementById('myProfileRole').textContent = ROLE_NAMES[user.role] || user.role;
    document.getElementById('myProfileEmail').textContent = user.email;
    document.getElementById('myProfileUserId').textContent = user.id;
    document.getElementById('myProfileCreatedAt').textContent = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Show/hide region based on role
    const regionRow = document.getElementById('myProfileRegionRow');
    if (user.region) {
        regionRow.style.display = 'flex';
        document.getElementById('myProfileRegion').textContent = user.region;
    } else {
        regionRow.style.display = 'none';
    }

    // Display profile photo
    const photoContainer = document.getElementById('myProfilePhoto');
    if (user.profilePhoto) {
        photoContainer.innerHTML = `<img src="${user.profilePhoto}" alt="${user.name}">`;
    } else {
        photoContainer.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        `;
    }

    // Show modal in view mode
    document.getElementById('myProfileViewMode').style.display = 'block';
    document.getElementById('myProfileEditMode').style.display = 'none';

    const modal = document.getElementById('myProfileModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Close My Profile modal
 */
function closeMyProfileModal() {
    const modal = document.getElementById('myProfileModal');
    if (modal) {
        modal.classList.remove('active');
    }

    // Reset form
    document.getElementById('myProfileEditForm').reset();
    currentProfilePhoto = null;
}

/**
 * Switch to edit mode
 */
function switchToEditMode() {
    const user = getCurrentUser();
    if (!user) return;

    // Hide view mode, show edit mode
    document.getElementById('myProfileViewMode').style.display = 'none';
    document.getElementById('myProfileEditMode').style.display = 'block';

    // Populate edit form with current photo
    const photoPreviewPlaceholder = document.getElementById('photoPreviewPlaceholder');
    const photoPreviewImage = document.getElementById('photoPreviewImage');
    const removePhotoBtn = document.getElementById('removePhotoBtn');

    if (user.profilePhoto) {
        photoPreviewPlaceholder.style.display = 'none';
        photoPreviewImage.src = user.profilePhoto;
        photoPreviewImage.style.display = 'block';
        removePhotoBtn.style.display = 'inline-block';
        currentProfilePhoto = user.profilePhoto;
    } else {
        photoPreviewPlaceholder.style.display = 'flex';
        photoPreviewImage.style.display = 'none';
        removePhotoBtn.style.display = 'none';
        currentProfilePhoto = null;
    }

    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('passwordStrength').style.display = 'none';
}

/**
 * Switch to view mode
 */
function switchToViewMode() {
    document.getElementById('myProfileViewMode').style.display = 'block';
    document.getElementById('myProfileEditMode').style.display = 'none';

    // Reset form
    document.getElementById('myProfileEditForm').reset();
    currentProfilePhoto = null;
}

/**
 * Handle photo selection
 */
function handlePhotoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        showNotification('Please select a JPG, PNG, or GIF image', 'error');
        return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        showNotification('Image size must be less than 2MB', 'error');
        return;
    }

    // Read and resize image
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            // Resize to 200x200
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');

            // Calculate crop dimensions for square
            const size = Math.min(img.width, img.height);
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;

            // Draw cropped and resized image
            ctx.drawImage(img, x, y, size, size, 0, 0, 200, 200);

            // Convert to base64
            const resizedBase64 = canvas.toDataURL('image/jpeg', 0.9);
            currentProfilePhoto = resizedBase64;

            // Update preview
            const photoPreviewPlaceholder = document.getElementById('photoPreviewPlaceholder');
            const photoPreviewImage = document.getElementById('photoPreviewImage');
            const removePhotoBtn = document.getElementById('removePhotoBtn');

            photoPreviewPlaceholder.style.display = 'none';
            photoPreviewImage.src = resizedBase64;
            photoPreviewImage.style.display = 'block';
            removePhotoBtn.style.display = 'inline-block';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Remove profile photo
 */
function removeProfilePhoto() {
    currentProfilePhoto = null;

    const photoPreviewPlaceholder = document.getElementById('photoPreviewPlaceholder');
    const photoPreviewImage = document.getElementById('photoPreviewImage');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const fileInput = document.getElementById('profilePhotoInput');

    photoPreviewPlaceholder.style.display = 'flex';
    photoPreviewImage.style.display = 'none';
    photoPreviewImage.src = '';
    removePhotoBtn.style.display = 'none';
    fileInput.value = '';
}

/**
 * Check password strength
 */
function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');

    if (!password) {
        strengthIndicator.style.display = 'none';
        return;
    }

    strengthIndicator.style.display = 'block';

    let strength = 0;
    let strengthLabel = '';

    // Check length
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;

    // Check for numbers
    if (/\d/.test(password)) strength++;

    // Check for lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Determine strength level
    if (strength <= 2) {
        strengthLabel = 'Weak';
        strengthFill.className = 'password-strength-fill weak';
        strengthText.textContent = 'Weak password';
        strengthText.className = 'weak';
    } else if (strength <= 4) {
        strengthLabel = 'Medium';
        strengthFill.className = 'password-strength-fill medium';
        strengthText.textContent = 'Medium strength';
        strengthText.className = 'medium';
    } else {
        strengthLabel = 'Strong';
        strengthFill.className = 'password-strength-fill strong';
        strengthText.textContent = 'Strong password';
        strengthText.className = 'strong';
    }
}

/**
 * Handle profile update
 */
function handleMyProfileUpdate(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        showNotification('No user logged in', 'error');
        return false;
    }

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let passwordChanged = false;
    let photoChanged = false;

    // Check if password change is requested
    if (currentPassword || newPassword || confirmPassword) {
        // Validate all password fields are filled
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Please fill in all password fields to change password', 'error');
            return false;
        }

        // Verify current password
        if (currentPassword !== user.password) {
            showNotification('Current password is incorrect', 'error');
            return false;
        }

        // Validate new password
        if (newPassword.length < 6) {
            showNotification('New password must be at least 6 characters', 'error');
            return false;
        }

        if (!/\d/.test(newPassword)) {
            showNotification('New password must contain at least one number', 'error');
            return false;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return false;
        }

        // Update password
        user.password = newPassword;
        user.lastPasswordChange = new Date().toISOString();
        passwordChanged = true;
    }

    // Check if photo changed
    if (currentProfilePhoto !== user.profilePhoto) {
        user.profilePhoto = currentProfilePhoto;
        photoChanged = true;
    }

    // Save updated user
    updateUserInStorage(user);
    setCurrentUser(user);

    // Update sidebar avatar if photo changed
    if (photoChanged) {
        updateSidebarAvatar(user.profilePhoto);
    }

    // Log the changes
    const changes = [];
    if (passwordChanged) changes.push('password');
    if (photoChanged) changes.push('profile photo');

    if (changes.length > 0) {
        logProfileUpdate(changes.join(' and '));
        showNotification(`Profile updated successfully! Changed: ${changes.join(' and ')}`, 'success');
    } else {
        showNotification('No changes made to profile', 'info');
    }

    // Switch back to view mode and refresh
    setTimeout(() => {
        closeMyProfileModal();
        showMyProfile();
    }, 1500);

    return false;
}

/**
 * Update user in localStorage
 */
function updateUserInStorage(updatedUser) {
    const users = loadUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);

    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('slt_users', JSON.stringify(users));
    }
}

/**
 * Update sidebar avatar with photo
 */
function updateSidebarAvatar(photoUrl) {
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (!sidebarAvatar) return;

    if (photoUrl) {
        sidebarAvatar.innerHTML = `<img src="${photoUrl}" alt="Profile">`;
    } else {
        sidebarAvatar.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        `;
    }
}

/**
 * Log profile update activity
 */
function logProfileUpdate(changes) {
    const user = getCurrentUser();
    if (!user) return;

    logActivity({
        action: 'PROFILE_UPDATE',
        userId: user.id,
        userName: user.name,
        role: user.role,
        details: {
            changes: changes,
            timestamp: new Date().toISOString()
        },
        message: `${user.name} updated their profile: ${changes}`
    });
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

    // Update sidebar avatar with profile photo
    updateSidebarAvatar(user.profilePhoto);

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
 * Save users to localStorage
 * @param {array} users - Array of user objects to save
 * @returns {boolean} Success status
 */
function saveUsers(users) {
    try {
        localStorage.setItem('platformUsers', JSON.stringify(users));
        console.log('Users saved successfully');
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
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

/**
 * Show job details
 * @param {number} jobId - Job ID to show details for
 */
function showJobDetails(jobId) {
    // Mock job data (in a real app, this would come from a database)
    const jobs = {
        1: {
            id: '#JOB-2024-001',
            title: 'CCTV Camera Installation',
            location: 'Colombo 07, Galle Road',
            partner: 'Kamal Silva',
            status: 'Assigned',
            statusClass: 'status-assigned',
            payment: 'LKR 15,000',
            deadline: 'Dec 25, 2024',
            service: 'CCTV Installation',
            description: 'Installation of 4 CCTV cameras with DVR system. Includes wiring, configuration, and testing. Customer requires night vision capability and remote viewing access.',
            created: 'Dec 20, 2024',
            priority: 'High'
        },
        2: {
            id: '#JOB-2024-002',
            title: 'Wi-Fi Mesh Installation',
            location: 'Kandy, Peradeniya Road',
            partner: 'Nimal Perera',
            status: 'In Progress',
            statusClass: 'status-progress',
            payment: 'LKR 12,500',
            deadline: 'Dec 24, 2024',
            service: 'Wi-Fi Mesh System',
            description: 'Setup of mesh Wi-Fi network covering 3-story building. Includes router configuration and signal optimization.',
            created: 'Dec 18, 2024',
            priority: 'Medium'
        },
        3: {
            id: '#JOB-2024-003',
            title: 'PABX Installation',
            location: 'Gampaha, Negombo',
            partner: 'Sunil Fernando',
            status: 'Pending Approval',
            statusClass: 'status-pending',
            payment: 'LKR 20,000',
            deadline: 'Dec 28, 2024',
            service: 'PABX System',
            description: 'Installation of 16-line PABX system for office. Includes programming, testing, and user training.',
            created: 'Dec 22, 2024',
            priority: 'High'
        }
    };

    const job = jobs[jobId];

    if (!job) {
        showNotification('Job not found', 'error');
        return;
    }

    // Populate modal with job data
    document.getElementById('jobDetailsId').textContent = job.id;
    document.getElementById('jobDetailsTitle').textContent = job.title;
    document.getElementById('jobDetailsLocation').textContent = job.location;
    document.getElementById('jobDetailsPartner').textContent = job.partner;
    document.getElementById('jobDetailsPayment').textContent = job.payment;
    document.getElementById('jobDetailsDeadline').textContent = job.deadline;
    document.getElementById('jobDetailsService').textContent = job.service;
    document.getElementById('jobDetailsDescription').textContent = job.description;
    document.getElementById('jobDetailsCreated').textContent = job.created;
    document.getElementById('jobDetailsPriority').textContent = job.priority;

    // Update status badge
    const statusBadge = document.getElementById('jobDetailsStatus');
    statusBadge.textContent = job.status;
    statusBadge.className = `status-badge ${job.statusClass}`;

    // Show modal
    document.getElementById('jobDetailsModal').classList.add('active');
}

/**
 * Close job details modal
 */
function closeJobDetailsModal() {
    document.getElementById('jobDetailsModal').classList.remove('active');
}

// === USER INITIALIZATION ===
/**
 * Initialize default users if they don't exist
 * Creates a default Super Admin user for first-time setup
 */
function initializeDefaultUsers() {
    const users = loadUsers();

    // Check if super admin already exists
    const superAdminExists = users.some(u => u.role === ROLES.SUPER_ADMIN);

    if (!superAdminExists) {
        console.log('No Super Admin found. Creating default Super Admin...');

        const defaultSuperAdmin = {
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

        addUser(defaultSuperAdmin);
        console.log('Default Super Admin created successfully');
        console.log('Login credentials: username=admin, password=admin123, role=super_admin');
    } else {
        console.log('Super Admin already exists');
    }
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

// My Profile functions
window.showMyProfile = showMyProfile;
window.closeMyProfileModal = closeMyProfileModal;
window.switchToEditMode = switchToEditMode;
window.switchToViewMode = switchToViewMode;
window.handlePhotoSelect = handlePhotoSelect;
window.removeProfilePhoto = removeProfilePhoto;
window.checkPasswordStrength = checkPasswordStrength;
window.handleMyProfileUpdate = handleMyProfileUpdate;
window.showJobDetails = showJobDetails;
window.closeJobDetailsModal = closeJobDetailsModal;

// User management functions
window.initializeDefaultUsers = initializeDefaultUsers;
window.loadUsers = loadUsers;
window.addUser = addUser;

// === INITIALIZATION ===
/**
 * Initialize the dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Dashboard: Initializing...');

    // Initialize default users (creates super admin if not exists)
    initializeDefaultUsers();

    // Load jobs from localStorage on initial page load
    // This ensures jobs are displayed when admin logs in
    const jobsSection = document.getElementById('jobsSection');
    if (jobsSection) {
        // Call displayJobs to populate the jobs table from localStorage
        // This will be called again when navigating to jobs section via showSection()
        displayJobs();
        console.log('Admin Dashboard: Jobs loaded from storage');
    }
});


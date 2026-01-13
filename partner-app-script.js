// ===================================
// TECH-LEAD PARTNER APP - JAVASCRIPT
// SLT Telecom Platform
// ===================================

// === SCREEN NAVIGATION ===
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// === LOGIN FUNCTIONALITY ===
function login(event) {
    event.preventDefault();

    // Get form values
    const username = event.target.querySelector('input[type="text"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    // Validate credentials against platformUsers
    const users = JSON.parse(localStorage.getItem('platformUsers') || '[]');
    const user = users.find(u =>
        (u.username === username || u.nvq === username || u.mobile === username) &&
        u.password === password &&
        u.role === 'tech_lead_partner'
    );

    if (!user) {
        showNotification('Invalid credentials', 'error');
        return false;
    }

    // Save current partner to session
    setCurrentPartner(user);

    // Simulate login delay
    const button = event.target.querySelector('.btn-primary');
    button.innerHTML = '<span>Signing In...</span>';
    button.style.opacity = '0.7';

    setTimeout(() => {
        // Show dashboard
        showScreen('dashboardScreen');

        // Reset button
        button.innerHTML = '<span>Sign In</span><div class="btn-shine"></div>';
        button.style.opacity = '1';

        // Load jobs from localStorage after dashboard is shown
        // This ensures jobs persist after logout/login
        setTimeout(() => {
            loadPartnerJobs();
            console.log('Partner App: Jobs loaded from storage after login');
        }, 100);

        // Show welcome notification with partner's name
        showNotification(`Welcome back, ${user.name}!`, 'success');
    }, 1500);

    return false;
}

// === JOB FILTERING ===
function filterJobs(filter) {
    const jobCards = document.querySelectorAll('.job-card');
    const tabs = document.querySelectorAll('.tab-btn');

    // Update active tab
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Filter jobs
    jobCards.forEach(card => {
        const status = card.getAttribute('data-status');

        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'assigned' && status === 'assigned') {
            card.style.display = 'block';
        } else if (filter === 'progress' && status === 'progress') {
            card.style.display = 'block';
        } else if (filter === 'pending' && status === 'pending') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// === JOB ACTIONS ===
function acceptJob(event, jobId) {
    event.stopPropagation();

    const button = event.target.closest('.btn-accept');
    button.innerHTML = '<span>Accepting...</span>';
    button.style.opacity = '0.7';

    setTimeout(() => {
        showNotification(`Job #JOB-2024-00${jobId} accepted successfully!`, 'success');

        // Update job card status
        const jobCard = event.target.closest('.job-card');
        jobCard.setAttribute('data-status', 'progress');

        const statusBadge = jobCard.querySelector('.job-status');
        statusBadge.className = 'job-status status-progress';
        statusBadge.textContent = 'In Progress';

        // Replace buttons with progress indicator
        const actionsDiv = jobCard.querySelector('.job-actions');
        actionsDiv.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 10%"></div>
            </div>
            <p class="progress-text">10% Complete</p>
            <button class="btn-complete" onclick="completeJob(event, ${jobId})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Mark Complete
            </button>
        `;

        // Update stats
        updateStats();
    }, 1000);
}

function raiseIssue(event, jobId) {
    event.stopPropagation();

    showNotification(`Issue form opened for Job #JOB-2024-00${jobId}`, 'info');
    // In a real app, this would open a modal/form
}

function completeJob(event, jobId) {
    event.stopPropagation();

    const button = event.target.closest('.btn-complete');
    button.innerHTML = '<span>Submitting...</span>';
    button.style.opacity = '0.7';

    setTimeout(() => {
        showNotification(`Job #JOB-2024-00${jobId} submitted for approval!`, 'success');

        // Update job card status
        const jobCard = event.target.closest('.job-card');
        jobCard.setAttribute('data-status', 'pending');

        const statusBadge = jobCard.querySelector('.job-status');
        statusBadge.className = 'job-status status-pending';
        statusBadge.textContent = 'Pending Approval';

        // Replace button with pending indicator
        const actionsDiv = jobCard.querySelector('.job-actions');
        actionsDiv.innerHTML = `
            <div class="pending-indicator">
                <div class="pulse-dot"></div>
                <span>Waiting for admin review...</span>
            </div>
        `;

        // Update stats
        updateStats();
    }, 1500);
}

// === JOB DETAILS ===
function showJobDetails(jobId) {
    showNotification(`Opening details for Job #JOB-2024-00${jobId}`, 'info');
    // In a real app, this would navigate to a details screen
}

// === NAVIGATION ===
function showEarnings() {
    showNotification('Earnings screen - Coming soon in full version', 'info');
    // In a real app, this would show earnings screen
}


// === BACK TO ROLE SELECTION ===
function backToRoleSelection() {
    const confirmed = confirm('Are you sure you want to return to role selection? You will be logged out.');

    if (confirmed) {
        // Navigate to index.html (role selection page)
        window.location.href = 'index.html';
    }
}

// === LOGOUT FUNCTIONALITY ===
function logout() {
    showLogoutConfirmation();
}

function showLogoutConfirmation() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function confirmLogout() {
    closeLogoutModal();

    // Clear current partner session
    clearCurrentPartner();

    // Simple console log instead of notification to avoid dependency issues
    console.log('Logging out...');

    setTimeout(() => {
        // Return to login screen
        showScreen('loginScreen');

        // Reset login form
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.reset();
        }
    }, 500); // Reduced timeout for faster logout
}

// === PROFILE MANAGEMENT ===
function showProfile() {
    showMyProfile();
}

/**
 * Show My Profile modal
 */
function showMyProfile() {
    // Mock partner data (in real app, would come from logged-in user)
    const partnerData = {
        name: 'Kamal Silva',
        nvq: 'NVQ-2024-1234',
        mobile: '+94 77 123 4567',
        region: 'Western Province',
        password: 'partner123', // In real app, would be hashed
        totalJobs: 24
    };

    // Populate view mode
    document.getElementById('myProfileName').textContent = partnerData.name;
    document.getElementById('myProfileNVQ').textContent = partnerData.nvq;
    document.getElementById('myProfileMobile').textContent = partnerData.mobile;
    document.getElementById('myProfileRegion').textContent = partnerData.region;
    document.getElementById('myProfileTotalJobs').textContent = partnerData.totalJobs;

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
    if (document.getElementById('myProfileEditForm')) {
        document.getElementById('myProfileEditForm').reset();
    }
}

/**
 * Switch to edit mode (password change)
 */
function switchToEditMode() {
    // Hide view mode, show edit mode
    document.getElementById('myProfileViewMode').style.display = 'none';
    document.getElementById('myProfileEditMode').style.display = 'block';

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
        strengthFill.className = 'password-strength-fill weak';
        strengthText.textContent = 'Weak password';
        strengthText.className = 'weak';
    } else if (strength <= 4) {
        strengthFill.className = 'password-strength-fill medium';
        strengthText.textContent = 'Medium strength';
        strengthText.className = 'medium';
    } else {
        strengthFill.className = 'password-strength-fill strong';
        strengthText.textContent = 'Strong password';
        strengthText.className = 'strong';
    }
}

/**
 * Handle password change
 */
function handlePasswordChange(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Mock current password (in real app, would verify against stored password)
    const storedPassword = 'partner123';

    // Verify current password
    if (currentPassword !== storedPassword) {
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

    // Simulate password update
    showNotification('Password updated successfully!', 'success');

    // Switch back to view mode
    setTimeout(() => {
        switchToViewMode();
    }, 1500);

    return false;
}

// === UTILITY FUNCTIONS ===

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Update statistics cards
 */
function updateStats() {
    const jobCards = document.querySelectorAll('.job-card');
    let activeCount = 0;
    let pendingCount = 0;
    let completedCount = 0;

    jobCards.forEach(card => {
        const status = card.getAttribute('data-status');
        if (status === 'assigned' || status === 'progress') {
            activeCount++;
        } else if (status === 'pending') {
            pendingCount++;
        }
    });

    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[0]) {
        statCards[0].querySelector('.stat-value').textContent = activeCount;
    }
    if (statCards[1]) {
        statCards[1].querySelector('.stat-value').textContent = pendingCount;
    }
    // Completed count stays the same (would come from backend in real app)
}

// Export functions for use in HTML
window.login = login;
window.backToRoleSelection = backToRoleSelection;
window.logout = logout;
window.showLogoutConfirmation = showLogoutConfirmation;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.filterJobs = filterJobs;
window.acceptJob = acceptJob;
window.raiseIssue = raiseIssue;
window.completeJob = completeJob;
window.showJobDetails = showJobDetails;
window.showEarnings = showEarnings;
window.showProfile = showProfile;
window.showMyProfile = showMyProfile;
window.closeMyProfileModal = closeMyProfileModal;
window.switchToEditMode = switchToEditMode;
window.switchToViewMode = switchToViewMode;
window.checkPasswordStrength = checkPasswordStrength;
window.handlePasswordChange = handlePasswordChange;
window.showNotification = showNotification;
window.updateStats = updateStats;

// === SESSION MANAGEMENT ===
/**
 * Save current logged-in partner to session storage
 */
function setCurrentPartner(user) {
    try {
        sessionStorage.setItem('currentPartner', JSON.stringify(user));
    } catch (error) {
        console.error('Error saving current partner:', error);
    }
}

/**
 * Get current logged-in partner from session storage
 */
function getCurrentPartner() {
    try {
        const userJson = sessionStorage.getItem('currentPartner');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error loading current partner:', error);
        return null;
    }
}

/**
 * Clear current partner from session storage
 */
function clearCurrentPartner() {
    try {
        sessionStorage.removeItem('currentPartner');
    } catch (error) {
        console.error('Error clearing current partner:', error);
    }
}

// === SHARED STORAGE HELPERS ===
function saveJobsToStorage(jobs) {
    try {
        localStorage.setItem('platformJobs', JSON.stringify(jobs));
    } catch (error) {
        console.error('Error saving jobs to storage:', error);
    }
}

function loadJobsFromStorage() {
    try {
        const jobsJson = localStorage.getItem('platformJobs');
        return jobsJson ? JSON.parse(jobsJson) : [];
    } catch (error) {
        console.error('Error loading jobs from storage:', error);
        return [];
    }
}

// === UPLOAD PROOF LOGIC ===
let currentUploadFile = null;

function completeJob(event, jobId) {
    event.stopPropagation();

    // Open modal instead of direct completion
    const modal = document.getElementById('uploadProofModal');
    if (modal) {
        // Set hidden job ID
        document.getElementById('uploadJobId').value = jobId;
        // Reset form
        document.getElementById('uploadProofForm').reset();
        removePhoto(null); // Clear preview

        modal.classList.add('active');
    }
}

function closeUploadProofModal() {
    const modal = document.getElementById('uploadProofModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            showNotification('Please upload an image file', 'error');
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('uploadPlaceholder').style.display = 'none';
            document.getElementById('uploadPreview').style.display = 'flex';
            document.getElementById('btnSubmitProof').disabled = false;
        };
        reader.readAsDataURL(file);
        currentUploadFile = file;
    }
}

function removePhoto(event) {
    if (event) event.stopPropagation();

    document.getElementById('proofFile').value = '';
    document.getElementById('previewImage').src = '';
    document.getElementById('uploadPlaceholder').style.display = 'block';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('btnSubmitProof').disabled = true;
    currentUploadFile = null;
}

function submitProof(event) {
    event.preventDefault();

    if (!currentUploadFile) {
        showNotification('Please upload a photo proof', 'error');
        return false;
    }

    const jobId = document.getElementById('uploadJobId').value;
    const button = document.getElementById('btnSubmitProof');

    button.innerHTML = '<span>Uploading...</span>';
    button.style.opacity = '0.7';

    // Convert to Base64 and Save
    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;

        setTimeout(() => {
            // Update Job Status
            submitJobStatusUpdate(jobId, base64Image);

            // Close Modal
            closeUploadProofModal();
            button.innerHTML = '<span>Submit for Approval</span><div class="btn-shine"></div>';
            button.style.opacity = '1';

            showNotification(`Job submitted for approval!`, 'success');
        }, 1500);
    };
    reader.readAsDataURL(currentUploadFile);

    return false;
}

function submitJobStatusUpdate(jobId, proofImage) {
    // 1. Update UI
    const numericId = parseInt(jobId); // Assuming IDs passed are 1, 2, etc.
    // Logic to find the correct card based on ID or button click context would be better, 
    // but here we might need to refresh the whole list if we want to be clean.
    // For now, let's just find the card if we can, or just refresh.

    // In this prototype, IDs are 1, 2, 3. The cards are hardcoded.
    // We should ideally transition the hardcoded cards to dynamic too, but to save scope,
    // let's update the DOM if it matches.

    // Find card with onclick having this ID
    // Since we don't have easy selectors for "onclick argument", let's rely on filterJobs or refresh.
    // But we can iterate.

    // Update LocalStorage (The Real Source of Truth)
    let jobs = loadJobsFromStorage();
    let job = jobs.find(j => j.id.endsWith(numericId) || j.id === jobId);

    // If job doesn't exist in storage (because it's a hardcoded demo job), create it?
    // The demo jobs (1, 2, 3) are hardcoded in HTML.
    // If we want to persist state, we should probably load them into storage if empty.

    if (!job) {
        // Create mock job in storage so Admin can see it
        job = {
            id: `JOB-2024-00${numericId}`,
            serviceType: 'Demo Service',
            location: 'Demo Location',
            region: 'Western Province',
            payment: 'LKR 15,000',
            deadline: 'Dec 25, 2024',
            partner: 'Kamal Silva',
            status: 'assigned',
            createdBy: 'System'
        };
        jobs.push(job);
    }

    job.status = 'pending_approval';
    job.proofImage = proofImage;
    job.submittedAt = new Date().toISOString();

    saveJobsToStorage(jobs);

    // Update UI Card
    // Simple DOM manipulation for the demo
    // We need to re-find the card. Since we don't have a clean way, let's reload or mock it.
    // Let's implement a simple UI update function.
    updateCardToPending(numericId);
}

function updateCardToPending(jobId) {
    // Find buttons that call completeJob(event, jobId)
    const buttons = document.querySelectorAll(`button[onclick="completeJob(event, ${jobId})"]`);
    buttons.forEach(btn => {
        const card = btn.closest('.job-card');
        if (card) {
            card.setAttribute('data-status', 'pending');
            // Update Header Status
            const statusBadge = card.querySelector('.job-status');
            if (statusBadge) {
                statusBadge.className = 'job-status status-pending';
                statusBadge.textContent = 'Pending Approval';
            }

            // Update Body Actions
            const actionsDiv = card.querySelector('.job-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = `
                    <div class="pending-indicator">
                        <div class="pulse-dot"></div>
                        <span>Waiting for admin review...</span>
                    </div>
                `;
            }

            // Update Progress/Status
            // Remove progress bar if exists
            const progressBar = card.querySelector('.progress-bar');
            if (progressBar) progressBar.remove();

            const progressText = card.querySelector('.progress-text');
            if (progressText) progressText.remove();
        }
    });
    updateStats();
}

// === DYNAMIC JOB LOADING ===
/**
 * Load and display jobs for current partner from localStorage
 */
function loadPartnerJobs() {
    const jobsContainer = document.querySelector('.jobs-container');
    if (!jobsContainer) return;

    console.log('Loading partner jobs from storage...');

    // Get current logged-in partner
    const currentPartner = getCurrentPartner();
    if (!currentPartner) {
        console.error('No partner logged in');
        jobsContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--gray);">
                <p style="font-size: 1.1rem; margin-bottom: 8px;">Please log in to view jobs</p>
            </div>
        `;
        return;
    }

    // Get jobs from localStorage
    const allJobs = loadJobsFromStorage();

    console.log(`Found ${allJobs.length} total jobs in storage`);

    // Filter jobs for current partner by matching partner name
    const partnerJobs = allJobs.filter(job => job.partner === currentPartner.name);

    console.log(`Found ${partnerJobs.length} jobs assigned to partner: ${currentPartner.name}`);

    // Clear existing jobs
    jobsContainer.innerHTML = '';

    // If no jobs, show message
    if (partnerJobs.length === 0) {
        jobsContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--gray);">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 20px; opacity: 0.3;">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <p style="font-size: 1.1rem; margin-bottom: 8px;">No jobs assigned yet</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">New jobs will appear here when assigned by admin</p>
            </div>
        `;
        return;
    }

    // Render each job
    partnerJobs.forEach(job => {
        renderJobCard(job);
    });

    // Update stats after loading
    updateStats();
}

/**
 * Render a single job card
 */
function renderJobCard(job) {
    const jobsContainer = document.querySelector('.jobs-container');
    if (!jobsContainer) return;

    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.setAttribute('data-status', job.status || 'assigned');

    // Determine status display
    let statusClass = 'status-assigned';
    let statusText = 'Assigned';
    if (job.status === 'in_progress' || job.status === 'progress') {
        statusClass = 'status-progress';
        statusText = 'In Progress';
    } else if (job.status === 'pending_approval' || job.status === 'pending') {
        statusClass = 'status-pending';
        statusText = 'Pending Approval';
    } else if (job.status === 'completed') {
        statusClass = 'status-completed';
        statusText = 'Completed';
    }

    jobCard.innerHTML = `
        <div class="job-header">
            <div class="job-id">
                <span class="job-label">Job ID</span>
                <span class="job-number">${job.id}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="job-status ${statusClass}">${statusText}</span>
                <button class="btn-view-details" onclick="showJobDetails('${job.id}')" title="View Details">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
        </div>

        <h3 class="job-title">${job.serviceType || job.title || 'Service Type Not Specified'}</h3>
        <p class="job-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${job.location || 'Location not specified'}
        </p>

        ${job.description ? `<p class="job-description" style="color: var(--gray); font-size: 0.9rem; margin: 12px 0; line-height: 1.5;">${job.description}</p>` : ''}

        <div class="job-details-grid">
            <div class="job-detail">
                <span class="detail-label">Payment</span>
                <span class="detail-value">${job.payment || 'TBD'}</span>
            </div>
            <div class="job-detail">
                <span class="detail-label">Deadline</span>
                <span class="detail-value">${job.deadline || 'TBD'}</span>
            </div>
        </div>

        <div class="job-actions">
            ${job.status === 'assigned' ? `
                <button class="btn-accept" onclick="acceptJob(event, '${job.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Accept Job
                </button>
                <button class="btn-issue" onclick="raiseIssue(event, '${job.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Issue
                </button>
            ` : job.status === 'progress' || job.status === 'in_progress' ? `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 50%"></div>
                </div>
                <p class="progress-text">50% Complete</p>
                <button class="btn-complete" onclick="completeJob(event, '${job.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Mark Complete
                </button>
            ` : job.status === 'pending' || job.status === 'pending_approval' ? `
                <div class="pending-indicator">
                    <div class="pulse-dot"></div>
                    <span>Waiting for admin review...</span>
                </div>
            ` : ''}
        </div>

        <div class="card-shimmer"></div>
    `;

    jobsContainer.appendChild(jobCard);
}

// === INIT & POLLING ===
document.addEventListener('DOMContentLoaded', () => {
    initJobStates();

    // Load jobs from localStorage when dashboard is active
    const dashboardScreen = document.getElementById('dashboardScreen');
    if (dashboardScreen && dashboardScreen.classList.contains('active')) {
        setTimeout(() => {
            loadPartnerJobs();
        }, 100);
    }

    // Check for approved/rejected jobs
    setInterval(checkForUpdates, 5000);
});

function initJobStates() {
    console.log('Initializing Job States from Storage...');
    const jobs = loadJobsFromStorage();

    jobs.forEach(job => {
        updateUiForJobState(job);
    });
}

function checkForUpdates() {
    const jobs = loadJobsFromStorage();
    jobs.forEach(job => {
        updateUiForJobState(job);
    });
}

function updateUiForJobState(job) {
    // Simple heuristic for demo: Look for DOM elements with matching ID suffix
    const suffix = job.id.split('-').pop(); // e.g. "001" or "1"
    const numericId = parseInt(suffix);

    // Select all cards
    const cards = document.querySelectorAll('.job-card');
    cards.forEach(card => {
        // Try to extract ID from card
        const idText = card.querySelector('.job-number').textContent; // #JOB-2024-001

        // Match Card
        if (idText.includes(job.id) || (idText.endsWith(numericId) && numericId < 1000)) {
            const currentUiStatus = card.getAttribute('data-status');

            // 1. PENDING APPROVAL
            if (job.status === 'pending_approval' && currentUiStatus !== 'pending') {
                // Force UI to pending
                updateCardToPending(numericId);
            }

            // 2. REJECTED (Storage: in_progress with reason)
            if (job.status === 'in_progress' && job.rejectionReason) {
                // If UI is pending, revert it. 
                // If UI is already progress, ensure note is shown.
                if (currentUiStatus === 'pending' || !card.querySelector('.rejection-note')) {
                    revertToInProgress(card, numericId, job.rejectionReason);
                }
            }

            // 3. COMPLETED
            if (job.status === 'completed' && currentUiStatus !== 'completed') {
                markAsCompleted(card);
            }
        }
    });
}

function revertToInProgress(card, id, reason) {
    // Ensure card is visible if it was hidden
    card.style.display = 'block';
    card.setAttribute('data-status', 'progress');

    // Badge
    const badge = card.querySelector('.job-status');
    if (badge) {
        badge.className = 'job-status status-progress';
        badge.textContent = 'In Progress';
    }

    // Actions - Restore "Mark Complete" button if not present
    const actionsDiv = card.querySelector('.job-actions');
    if (actionsDiv && !actionsDiv.querySelector('.btn-complete')) {
        actionsDiv.innerHTML = `
            <button class="btn-complete" onclick="completeJob(event, ${id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Mark Complete
            </button>
        `;
    }

    // Add Rejection Note
    let note = card.querySelector('.rejection-note');
    if (!note && reason) {
        note = document.createElement('div');
        note.className = 'rejection-note';
        note.style.color = 'var(--status-rejected)';
        note.style.background = 'rgba(239, 68, 68, 0.1)';
        note.style.padding = '10px';
        note.style.borderRadius = '8px';
        note.style.marginTop = '10px';
        note.style.fontSize = '0.9rem';

        // Insert before actions
        if (actionsDiv) {
            actionsDiv.parentNode.insertBefore(note, actionsDiv);
        }
    }
    if (note) {
        note.innerHTML = `<strong>Admin Rejected:</strong> ${reason}`;
    }

    updateStats();
}

function markAsCompleted(card) {
    // If it's already completed in UI, do nothing
    if (card.getAttribute('data-status') === 'completed') return;

    card.setAttribute('data-status', 'completed');

    // Visual update for completed state
    const badge = card.querySelector('.job-status');
    if (badge) {
        badge.className = 'job-status status-completed';
        badge.textContent = 'Completed';
    }

    // Hide actions
    const actionsDiv = card.querySelector('.job-actions');
    if (actionsDiv) actionsDiv.innerHTML = '';

    // Remove progress bar if exists
    const progressBar = card.querySelector('.progress-bar');
    if (progressBar) progressBar.remove();

    const progressText = card.querySelector('.progress-text');
    if (progressText) progressText.remove();

    showNotification('Job approved and completed!', 'success');
    updateStats();
}

window.completeJob = completeJob;
window.handleFileSelect = handleFileSelect;
window.submitProof = submitProof;
window.removePhoto = removePhoto;
window.closeUploadProofModal = closeUploadProofModal;

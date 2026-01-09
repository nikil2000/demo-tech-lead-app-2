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

    // Simple validation (prototype only)
    if (username && password) {
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

            // Show welcome notification
            showNotification('Welcome back! You have 3 new job assignments.', 'success');
        }, 1500);
    }

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

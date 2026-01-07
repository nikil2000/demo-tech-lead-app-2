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

function showProfile() {
    showNotification('Profile screen - Coming soon in full version', 'info');
    // In a real app, this would show profile screen
}

// === STATS UPDATE ===
function updateStats() {
    // Recalculate stats based on current job cards
    const jobCards = document.querySelectorAll('.job-card');
    let activeCount = 0;
    let pendingCount = 0;
    let completedCount = 24; // Base count
    
    jobCards.forEach(card => {
        const status = card.getAttribute('data-status');
        if (status === 'progress') activeCount++;
        if (status === 'pending') pendingCount++;
    });
    
    // Update stat cards with animation
    animateValue(document.querySelector('.stat-card-1 .stat-value'), activeCount);
    animateValue(document.querySelector('.stat-card-2 .stat-value'), pendingCount);
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

// === NOTIFICATIONS ===
function showNotification(message, type = 'info') {
    // Create notification element
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
    
    // Add styles
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
    
    // Append to document
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('Tech-Lead Partner App initialized');
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation to job cards
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 * index);
    });
});

// === PROTOTYPE HELPERS ===
// These functions simulate backend interactions for the prototype

function simulateDataLoad() {
    // Simulate loading data from backend
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                jobs: [
                    { id: 1, title: 'CCTV Camera Installation', status: 'assigned' },
                    { id: 2, title: 'Wi-Fi Mesh Installation', status: 'progress' },
                    { id: 3, title: 'PABX Installation', status: 'pending' }
                ],
                stats: {
                    active: 5,
                    pending: 2,
                    completed: 24
                }
            });
        }, 500);
    });
}

// Export functions for use in HTML
window.login = login;
window.filterJobs = filterJobs;
window.acceptJob = acceptJob;
window.raiseIssue = raiseIssue;
window.completeJob = completeJob;
window.showJobDetails = showJobDetails;
window.showEarnings = showEarnings;
window.showProfile = showProfile;

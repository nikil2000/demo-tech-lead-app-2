// ===================================
// UNIFIED APP - SHARED STATE MANAGEMENT
// SLT Telecom Platform
// ===================================

// === SHARED STATE ===
const AppState = {
    jobs: [
        {
            id: 1,
            title: 'CCTV Camera Installation',
            location: 'Colombo 07, Galle Road',
            payment: 'LKR 15,000',
            deadline: 'Dec 25, 2024',
            status: 'assigned',
            partner: 'Current User',
            photos: 0,
            documents: 0
        },
        {
            id: 2,
            title: 'Wi-Fi Mesh Installation',
            location: 'Kandy, Peradeniya Road',
            payment: 'LKR 12,500',
            deadline: 'Dec 26, 2024',
            status: 'progress',
            partner: 'Current User',
            progress: 65,
            photos: 0,
            documents: 0
        },
        {
            id: 3,
            title: 'PABX Installation',
            location: 'Gampaha, Negombo',
            payment: 'LKR 20,000',
            deadline: 'Dec 24, 2024',
            status: 'pending',
            partner: 'Current User',
            photos: 3,
            documents: 2,
            submittedTime: '2 hours ago'
        }
    ],
    currentRole: null
};

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

// === ROLE SELECTION ===
function selectRole(role) {
    AppState.currentRole = role;

    if (role === 'partner') {
        showScreen('partnerLoginScreen');
    } else if (role === 'admin') {
        // Redirect directly to the comprehensive admin dashboard
        window.location.href = 'admin-dashboard.html';
    }
}

function backToRoleSelection() {
    AppState.currentRole = null;
    showScreen('roleSelectionScreen');
}

// === PARTNER LOGIN ===
function partnerLogin(event) {
    event.preventDefault();

    const button = event.target.querySelector('.btn-primary');
    button.innerHTML = '<span>Signing In...</span>';
    button.style.opacity = '0.7';

    setTimeout(() => {
        showScreen('partnerDashboardScreen');
        button.innerHTML = '<span>Sign In</span><div class="btn-shine"></div>';
        button.style.opacity = '1';

        loadPartnerJobs();
        updatePartnerStats();
        showNotification('Welcome back! You have job updates.', 'success');
    }, 1500);

    return false;
}

// === ADMIN LOGIN ===
function adminLogin(event) {
    event.preventDefault();

    const button = event.target.querySelector('.btn-primary');
    button.innerHTML = '<span>Signing In...</span>';
    button.style.opacity = '0.7';

    setTimeout(() => {
        // Redirect to the standalone admin dashboard with role-based access control
        window.location.href = 'admin-dashboard.html';
    }, 1500);

    return false;
}

// === PARTNER DASHBOARD ===
function loadPartnerJobs() {
    const container = document.getElementById('partnerJobsContainer');
    container.innerHTML = '';

    AppState.jobs.forEach((job, index) => {
        const jobCard = createPartnerJobCard(job);
        jobCard.style.opacity = '0';
        container.appendChild(jobCard);

        setTimeout(() => {
            jobCard.style.opacity = '1';
        }, 100 * index);
    });
}

function createPartnerJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.setAttribute('data-status', job.status);
    card.onclick = () => showJobDetails(job.id);

    let statusClass = '';
    let statusText = '';
    let actionsHTML = '';

    if (job.status === 'assigned') {
        statusClass = 'status-assigned';
        statusText = 'Assigned';
        actionsHTML = `
            <div class="job-actions">
                <button class="btn-accept" onclick="event.stopPropagation(); acceptJob(${job.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Accept Job
                </button>
                <button class="btn-issue" onclick="event.stopPropagation(); raiseIssue(${job.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                    </svg>
                    Issue
                </button>
            </div>
        `;
    } else if (job.status === 'progress') {
        statusClass = 'status-progress';
        statusText = 'In Progress';
        actionsHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${job.progress}%"></div>
            </div>
            <p class="progress-text">${job.progress}% Complete</p>
            <div class="job-actions">
                <button class="btn-complete" onclick="event.stopPropagation(); completeJob(${job.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Mark Complete
                </button>
            </div>
        `;
    } else if (job.status === 'pending') {
        statusClass = 'status-pending';
        statusText = 'Pending Approval';
        actionsHTML = `
            <div class="pending-indicator">
                <div class="pulse-dot"></div>
                <span>Waiting for admin review...</span>
            </div>
        `;
    } else if (job.status === 'completed') {
        statusClass = 'status-completed';
        statusText = 'Completed';
        actionsHTML = `
            <div class="completed-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Job completed successfully!</span>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="card-shimmer"></div>
        <div class="job-header">
            <div class="job-id">
                <span class="job-label">Job ID</span>
                <span class="job-number">#JOB-2024-00${job.id}</span>
            </div>
            <span class="job-status ${statusClass}">${statusText}</span>
        </div>
        <h3 class="job-title">${job.title}</h3>
        <div class="job-location">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${job.location}</span>
        </div>
        <div class="job-details-grid">
            <div class="job-detail">
                <span class="detail-label">Payment</span>
                <span class="detail-value">${job.payment}</span>
            </div>
            <div class="job-detail">
                <span class="detail-label">Deadline</span>
                <span class="detail-value">${job.deadline}</span>
            </div>
        </div>
        ${actionsHTML}
    `;

    return card;
}

function updatePartnerStats() {
    const pending = AppState.jobs.filter(j => j.status === 'pending').length;
    const completed = AppState.jobs.filter(j => j.status === 'completed').length;

    document.getElementById('partnerPendingCount').textContent = pending;
    document.getElementById('partnerCompletedCount').textContent = completed;
}

// === ADMIN DASHBOARD ===
function loadAdminApprovals() {
    const container = document.getElementById('adminApprovalsContainer');
    const pendingJobs = AppState.jobs.filter(j => j.status === 'pending');

    container.innerHTML = '';

    if (pendingJobs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 40px;">No pending approvals</p>';
        return;
    }

    pendingJobs.forEach((job, index) => {
        const card = createApprovalCard(job);
        card.style.opacity = '0';
        container.appendChild(card);

        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 * index);
    });
}

function createApprovalCard(job) {
    const card = document.createElement('div');
    card.className = 'approval-card';
    card.id = `approval-card-${job.id}`;

    card.innerHTML = `
        <div class="approval-header">
            <span class="job-id-badge">#JOB-2024-00${job.id}</span>
            <span class="time-badge">${job.submittedTime}</span>
        </div>
        <h3 class="approval-title">${job.title}</h3>
        <p class="approval-location">📍 ${job.location}</p>
        <p class="approval-partner">👤 Partner: ${job.partner}</p>
        
        <div class="approval-images">
            <div class="image-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>${job.photos} Photos</p>
            </div>
            <div class="image-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <p>${job.documents} Documents</p>
            </div>
        </div>

        <div class="approval-actions">
            <button class="btn-approve" onclick="approveJob(${job.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Approve
            </button>
            <button class="btn-reject" onclick="rejectJob(${job.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Reject
            </button>
        </div>
    `;

    return card;
}

function updateAdminStats() {
    const total = AppState.jobs.length;
    const pending = AppState.jobs.filter(j => j.status === 'pending').length;
    const completed = AppState.jobs.filter(j => j.status === 'completed').length;

    document.getElementById('adminTotalJobs').textContent = total;
    document.getElementById('adminPendingCount').textContent = pending;
    document.getElementById('adminCompletedCount').textContent = completed;
    document.getElementById('adminPendingBadge').textContent = pending;
}

// === JOB ACTIONS ===
function acceptJob(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (job) {
        job.status = 'progress';
        job.progress = 10;
        loadPartnerJobs();
        updatePartnerStats();
        showNotification(`Job #JOB-2024-00${jobId} accepted successfully!`, 'success');
    }
}

function completeJob(jobId) {
    // Store the job ID for later use
    AppState.currentJobId = jobId;

    // Open image upload modal
    openImageUploadModal(jobId);
}

// === IMAGE UPLOAD FOR JOB COMPLETION ===
let uploadedFiles = [];

function openImageUploadModal(jobId) {
    const modal = document.getElementById('imageUploadModal');
    const job = AppState.jobs.find(j => j.id === jobId);

    if (!job) return;

    // Reset uploaded files
    uploadedFiles = [];
    document.getElementById('uploadedImages').innerHTML = '';
    document.getElementById('submitJobBtn').disabled = true;

    modal.classList.add('active');
}

function closeImageUpload(event) {
    const modal = document.getElementById('imageUploadModal');
    if (!event || event.target === modal) {
        modal.classList.remove('active');
        uploadedFiles = [];
        document.getElementById('uploadedImages').innerHTML = '';
        document.getElementById('fileInput').value = '';
    }
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);

    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                uploadedFiles.push({
                    file: file,
                    dataUrl: e.target.result
                });

                displayUploadedImages();

                // Enable submit button if at least one image
                document.getElementById('submitJobBtn').disabled = uploadedFiles.length === 0;
            };

            reader.readAsDataURL(file);
        }
    });

    // Reset file input
    event.target.value = '';
}

function displayUploadedImages() {
    const container = document.getElementById('uploadedImages');
    container.innerHTML = '';

    uploadedFiles.forEach((fileData, index) => {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${fileData.dataUrl}" alt="Preview ${index + 1}">
            <button class="image-preview-remove" onclick="removeImage(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        container.appendChild(preview);
    });
}

function removeImage(index) {
    uploadedFiles.splice(index, 1);
    displayUploadedImages();
    document.getElementById('submitJobBtn').disabled = uploadedFiles.length === 0;
}

function submitJobCompletion() {
    const jobId = AppState.currentJobId;
    const job = AppState.jobs.find(j => j.id === jobId);

    if (job && uploadedFiles.length > 0) {
        job.status = 'pending';
        job.photos = uploadedFiles.length;
        job.documents = 1; // Simulated document count
        job.submittedTime = 'Just now';
        job.uploadedImages = uploadedFiles.map(f => f.dataUrl); // Store image data

        loadPartnerJobs();
        updatePartnerStats();
        closeImageUpload();

        showNotification(`Job #JOB-2024-00${jobId} submitted for approval with ${uploadedFiles.length} photo(s)!`, 'success');
    }
}

function approveJob(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (job) {
        job.status = 'completed';

        // Remove from admin approvals
        const card = document.getElementById(`approval-card-${jobId}`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                loadAdminApprovals();
            }, 300);
        }

        // Update stats
        updateAdminStats();
        updatePartnerStats();

        showNotification(`Job #JOB-2024-00${jobId} approved successfully!`, 'success');
    }
}

function raiseIssue(jobId) {
    showNotification(`Issue form opened for Job #JOB-2024-00${jobId}`, 'info');
}

function rejectJob(jobId) {
    showNotification(`Rejection form opened for Job #JOB-2024-00${jobId}`, 'info');
}

// === ADMIN SECTION NAVIGATION ===
function showAdminSection(sectionName, event) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    if (event && event.target) {
        const navLink = event.target.closest('.nav-link');
        if (navLink) {
            navLink.classList.add('active');
        }
    }

    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const sectionMap = {
        'overview': 'adminOverviewSection',
        'jobs': 'adminJobsSection',
        'approval': 'adminApprovalSection'
    };

    const targetSection = document.getElementById(sectionMap[sectionName]);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const titles = {
        'overview': {
            title: 'Dashboard Overview',
            subtitle: 'Monitor and manage all tech-lead partner activities'
        },
        'jobs': {
            title: 'Jobs Management',
            subtitle: 'Create, view, and manage all jobs'
        },
        'approval': {
            title: 'Pending Approvals',
            subtitle: 'Review and approve completed jobs'
        }
    };

    const titleInfo = titles[sectionName];
    document.getElementById('adminSectionTitle').textContent = titleInfo.title;
    document.getElementById('adminSectionSubtitle').textContent = titleInfo.subtitle;

    // Load jobs table when navigating to jobs section
    if (sectionName === 'jobs') {
        loadJobsTable();
    }
}

// === JOB CREATION ===
function toggleJobForm() {
    const formContainer = document.getElementById('jobFormContainer');
    if (formContainer.style.display === 'none') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
        // Reset form
        formContainer.querySelector('form').reset();
    }
}

function createJob(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Get next job ID
    const newId = AppState.jobs.length > 0 ? Math.max(...AppState.jobs.map(j => j.id)) + 1 : 1;

    // Format payment
    const payment = parseInt(formData.get('payment'));
    const formattedPayment = `LKR ${payment.toLocaleString()}`;

    // Format deadline
    const deadlineDate = new Date(formData.get('deadline'));
    const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Create new job object
    const newJob = {
        id: newId,
        title: formData.get('title'),
        location: formData.get('location'),
        payment: formattedPayment,
        deadline: formattedDeadline,
        status: 'assigned',
        partner: formData.get('partner'),
        description: formData.get('description') || '',
        photos: 0,
        documents: 0
    };

    // Add to AppState
    AppState.jobs.push(newJob);

    // Update all views
    loadJobsTable();
    loadPartnerJobs();
    updateAdminStats();
    updatePartnerStats();

    // Hide form and show notification
    toggleJobForm();
    showNotification(`Job #JOB-2024-00${newId} created successfully!`, 'success');

    return false;
}

// === JOBS TABLE ===
function loadJobsTable(filter = 'all') {
    const tbody = document.getElementById('jobsTableBody');
    tbody.innerHTML = '';

    let jobsToShow = AppState.jobs;

    // Apply filter
    if (filter !== 'all') {
        jobsToShow = AppState.jobs.filter(j => j.status === filter);
    }

    if (jobsToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">No jobs found</td></tr>';
        return;
    }

    jobsToShow.forEach(job => {
        const row = document.createElement('tr');
        row.onclick = () => openJobDetail(job.id);

        const statusClass = job.status;
        const statusText = {
            'assigned': 'Assigned',
            'progress': 'In Progress',
            'pending': 'Pending',
            'completed': 'Completed'
        }[job.status] || job.status;

        row.innerHTML = `
            <td><a href="#" class="job-id-link" onclick="event.stopPropagation(); openJobDetail(${job.id}); return false;">#JOB-2024-00${job.id}</a></td>
            <td>${job.title}</td>
            <td>${job.location}</td>
            <td>${job.partner}</td>
            <td><span class="job-status-badge ${statusClass}">${statusText}</span></td>
            <td>${job.payment}</td>
            <td><button class="btn-view-job" onclick="event.stopPropagation(); openJobDetail(${job.id})">View</button></td>
        `;

        tbody.appendChild(row);
    });
}

// === JOBS LIST (FROM STATS CLICK) ===
function showJobsList(filter) {
    // Navigate to jobs section
    showAdminSection('jobs');

    // Apply filter
    setTimeout(() => {
        filterAdminJobs(filter);
    }, 100);
}

// === JOB FILTERING ===
function filterAdminJobs(filter, event) {
    // Update active tab
    if (event) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    // Load filtered jobs
    loadJobsTable(filter);
}

// === JOB SEARCH ===
function searchJobs(query) {
    const tbody = document.getElementById('jobsTableBody');
    const rows = tbody.querySelectorAll('tr');

    const searchTerm = query.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// === JOB DETAIL MODAL ===
function openJobDetail(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.getElementById('jobDetailModal');
    const content = document.getElementById('jobDetailContent');

    const statusText = {
        'assigned': 'Assigned',
        'progress': 'In Progress',
        'pending': 'Pending Approval',
        'completed': 'Completed'
    }[job.status] || job.status;

    const statusClass = job.status;

    content.innerHTML = `
        <div class="job-detail-grid">
            <div class="job-detail-item">
                <span class="job-detail-label">Job ID</span>
                <span class="job-detail-value">#JOB-2024-00${job.id}</span>
            </div>
            
            <div class="job-detail-item">
                <span class="job-detail-label">Service Type</span>
                <span class="job-detail-value">${job.title}</span>
            </div>
            
            <div class="job-detail-item">
                <span class="job-detail-label">Location</span>
                <span class="job-detail-value">📍 ${job.location}</span>
            </div>
            
            <div class="job-detail-item">
                <span class="job-detail-label">Assigned Partner</span>
                <span class="job-detail-value">${job.partner}</span>
            </div>
            
            <div class="job-detail-item">
                <span class="job-detail-label">Status</span>
                <span class="job-status-badge ${statusClass}">${statusText}</span>
            </div>
            
            <div class="job-detail-item">
                <span class="job-detail-label">Payment Amount</span>
                <span class="job-detail-value">${job.payment}</span>
            </div>
            
            <div class="job-detail-item">
                <span class="job-detail-label">Deadline</span>
                <span class="job-detail-value">${job.deadline}</span>
            </div>
            
            ${job.progress !== undefined ? `
                <div class="job-detail-item">
                    <span class="job-detail-label">Progress</span>
                    <span class="job-detail-value">${job.progress}%</span>
                </div>
            ` : ''}
            
            ${job.description ? `
                <div class="job-detail-item">
                    <span class="job-detail-label">Description</span>
                    <div class="job-detail-description">${job.description}</div>
                </div>
            ` : ''}
            
            ${job.status === 'pending' || job.status === 'completed' ? `
                <div class="job-detail-item">
                    <span class="job-detail-label">Attachments</span>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <span>📷 ${job.photos} Photos</span>
                        <span>📄 ${job.documents} Documents</span>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    modal.classList.add('active');
}

function closeJobDetail(event) {
    const modal = document.getElementById('jobDetailModal');
    if (!event || event.target === modal) {
        modal.classList.remove('active');
    }
}

// === PARTNER JOB FILTERING ===
function filterJobs(filter, event) {
    const jobCards = document.querySelectorAll('.job-card');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => tab.classList.remove('active'));

    if (event && event.target) {
        event.target.classList.add('active');
    }

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
        } else if (filter === 'completed' && status === 'completed') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// === UTILITY FUNCTIONS ===
function showJobDetails(jobId) {
    showNotification(`Opening details for Job #JOB-2024-00${jobId}`, 'info');
}

function showEarnings() {
    showNotification('Earnings screen - Coming soon', 'info');
}

function logout() {
    const confirmed = confirm('Are you sure you want to logout?\n\nClick OK to logout or Cancel to stay logged in.');

    if (confirmed) {
        // Clear current role
        AppState.currentRole = null;

        // Reset to role selection screen
        showScreen('roleSelectionScreen');

        // Show success notification
        showNotification('Logged out successfully', 'info');

        // Reset any active filters or forms
        const jobFormContainer = document.getElementById('jobFormContainer');
        if (jobFormContainer) {
            jobFormContainer.style.display = 'none';
        }

        // Reset admin section to overview
        const overviewSection = document.getElementById('adminOverviewSection');
        if (overviewSection) {
            overviewSection.classList.add('active');
        }
    }
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

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('Unified SLT Tech-Lead Platform initialized');
    document.documentElement.style.scrollBehavior = 'smooth';
});

// ===================================
// PERMISSIONS & ROLE MANAGEMENT
// SLT Tech-Lead Partner Platform
// ===================================

// === ROLE DEFINITIONS ===
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    DEVELOPER: 'developer',
    REGIONAL_MANAGER: 'regional_manager',
    BUSINESS_SUPPORT: 'business_support',
    TECH_LEAD_PARTNER: 'tech_lead_partner'
};

// Role Display Names
const ROLE_NAMES = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.DEVELOPER]: 'Developer',
    [ROLES.REGIONAL_MANAGER]: 'Regional Manager',
    [ROLES.BUSINESS_SUPPORT]: 'Business Support Team',
    [ROLES.TECH_LEAD_PARTNER]: 'Tech-Lead Partner'
};

// Role Descriptions
const ROLE_DESCRIPTIONS = {
    [ROLES.SUPER_ADMIN]: 'SLT Head Office / Central IT / Digital Team',
    [ROLES.DEVELOPER]: 'Internal or outsourced development team',
    [ROLES.REGIONAL_MANAGER]: 'SLT Regional Heads / Managers',
    [ROLES.BUSINESS_SUPPORT]: 'Central operational team',
    [ROLES.TECH_LEAD_PARTNER]: 'Field technicians / freelancers (NVQ-4)'
};

// Access Levels
const ACCESS_LEVELS = {
    [ROLES.SUPER_ADMIN]: 'Highest',
    [ROLES.DEVELOPER]: 'Highest',
    [ROLES.REGIONAL_MANAGER]: 'Read + Oversight',
    [ROLES.BUSINESS_SUPPORT]: 'Operational Control',
    [ROLES.TECH_LEAD_PARTNER]: 'Limited & Task-Based'
};

// === PERMISSION CONSTANTS ===
const PERMISSIONS = {
    // User Management
    USER_MANAGEMENT: 'user_management',
    CREATE_USERS: 'create_users',
    UPDATE_USERS: 'update_users',
    DEACTIVATE_USERS: 'deactivate_users',
    RESET_PASSWORDS: 'reset_passwords',
    ASSIGN_ROLES: 'assign_roles',

    // System Settings
    SYSTEM_SETTINGS: 'system_settings',
    CONFIGURE_REGIONS: 'configure_regions',
    CONFIGURE_SERVICES: 'configure_services',

    // API & Logs
    API_LOGS: 'api_logs',
    AUDIT_LOGS: 'audit_logs',

    // Job Management
    CREATE_JOBS: 'create_jobs',
    ASSIGN_JOBS: 'assign_jobs',
    APPROVE_JOBS: 'approve_jobs',
    VIEW_ALL_JOBS: 'view_all_jobs',
    VIEW_REGIONAL_JOBS: 'view_regional_jobs',
    VIEW_ASSIGNED_JOBS: 'view_assigned_jobs',
    UPDATE_JOB_STATUS: 'update_job_status',

    // Reports
    VIEW_ALL_REPORTS: 'view_all_reports',
    VIEW_REGIONAL_REPORTS: 'view_regional_reports',

    // Payments
    DEFINE_PAYMENTS: 'define_payments',
    VIEW_PAYMENTS: 'view_payments',

    // Documents
    UPLOAD_DOCUMENTS: 'upload_documents',
    VIEW_DOCUMENTS: 'view_documents'
};

// === PERMISSION MATRIX ===
// Based on Role vs Permissions Matrix from slides
const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: [
        // Full system control
        PERMISSIONS.USER_MANAGEMENT,
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.UPDATE_USERS,
        PERMISSIONS.DEACTIVATE_USERS,
        PERMISSIONS.RESET_PASSWORDS,
        PERMISSIONS.ASSIGN_ROLES,
        PERMISSIONS.SYSTEM_SETTINGS,
        PERMISSIONS.CONFIGURE_REGIONS,
        PERMISSIONS.CONFIGURE_SERVICES,
        PERMISSIONS.API_LOGS,
        PERMISSIONS.AUDIT_LOGS,
        PERMISSIONS.CREATE_JOBS,
        PERMISSIONS.ASSIGN_JOBS,
        PERMISSIONS.APPROVE_JOBS,
        PERMISSIONS.VIEW_ALL_JOBS,
        PERMISSIONS.VIEW_ALL_REPORTS,
        PERMISSIONS.VIEW_REGIONAL_REPORTS,
        PERMISSIONS.DEFINE_PAYMENTS,
        PERMISSIONS.VIEW_PAYMENTS,
        PERMISSIONS.VIEW_DOCUMENTS
    ],

    [ROLES.DEVELOPER]: [
        // Same as Super Admin - Full system control
        PERMISSIONS.USER_MANAGEMENT,
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.UPDATE_USERS,
        PERMISSIONS.DEACTIVATE_USERS,
        PERMISSIONS.RESET_PASSWORDS,
        PERMISSIONS.ASSIGN_ROLES,
        PERMISSIONS.SYSTEM_SETTINGS,
        PERMISSIONS.CONFIGURE_REGIONS,
        PERMISSIONS.CONFIGURE_SERVICES,
        PERMISSIONS.API_LOGS,
        PERMISSIONS.AUDIT_LOGS,
        PERMISSIONS.CREATE_JOBS,
        PERMISSIONS.ASSIGN_JOBS,
        PERMISSIONS.APPROVE_JOBS,
        PERMISSIONS.VIEW_ALL_JOBS,
        PERMISSIONS.VIEW_ALL_REPORTS,
        PERMISSIONS.VIEW_REGIONAL_REPORTS,
        PERMISSIONS.DEFINE_PAYMENTS,
        PERMISSIONS.VIEW_PAYMENTS,
        PERMISSIONS.VIEW_DOCUMENTS
    ],

    [ROLES.REGIONAL_MANAGER]: [
        // Regional oversight - Read + Oversight
        PERMISSIONS.CREATE_JOBS, // Optional
        PERMISSIONS.VIEW_REGIONAL_JOBS,
        PERMISSIONS.VIEW_REGIONAL_REPORTS,
        PERMISSIONS.VIEW_DOCUMENTS
        // Cannot: change system settings, user management, assign jobs, approve jobs
    ],

    [ROLES.BUSINESS_SUPPORT]: [
        // Operational control
        PERMISSIONS.CREATE_JOBS,
        PERMISSIONS.ASSIGN_JOBS,
        PERMISSIONS.APPROVE_JOBS,
        PERMISSIONS.DEFINE_PAYMENTS,
        PERMISSIONS.VIEW_PAYMENTS,
        PERMISSIONS.VIEW_REGIONAL_REPORTS,
        PERMISSIONS.VIEW_DOCUMENTS
        // Cannot: user management, system settings, API logs
    ],

    [ROLES.TECH_LEAD_PARTNER]: [
        // Limited & Task-Based
        PERMISSIONS.VIEW_ASSIGNED_JOBS,
        PERMISSIONS.UPDATE_JOB_STATUS,
        PERMISSIONS.UPLOAD_DOCUMENTS,
        PERMISSIONS.VIEW_DOCUMENTS
        // Cannot: see other partners' jobs, edit payments, create jobs
    ]
};

// === PERMISSION CHECKING FUNCTIONS ===

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
function hasPermission(role, permission) {
    if (!role || !permission) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
}

/**
 * Check if current user has a specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
function canAccess(permission) {
    const currentRole = getCurrentUserRole();
    return hasPermission(currentRole, permission);
}

/**
 * Get current user's role from session
 * @returns {string|null}
 */
function getCurrentUserRole() {
    return sessionStorage.getItem('userRole') || null;
}

/**
 * Get current user's info from session
 * @returns {object|null}
 */
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Set current user in session
 * @param {object} user - User object with role, name, etc.
 */
function setCurrentUser(user) {
    sessionStorage.setItem('userRole', user.role);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Clear current user session
 */
function clearCurrentUser() {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('lastActivity');
}

/**
 * Check if user can view all jobs (not region-filtered)
 * @returns {boolean}
 */
function canViewAllJobs() {
    return canAccess(PERMISSIONS.VIEW_ALL_JOBS);
}

/**
 * Check if user can only view regional jobs
 * @returns {boolean}
 */
function canViewRegionalJobs() {
    return canAccess(PERMISSIONS.VIEW_REGIONAL_JOBS);
}

/**
 * Check if user can only view assigned jobs
 * @returns {boolean}
 */
function canViewAssignedJobs() {
    return canAccess(PERMISSIONS.VIEW_ASSIGNED_JOBS);
}

/**
 * Get role-specific capabilities
 * @param {string} role - User role
 * @returns {object}
 */
function getRoleCapabilities(role) {
    const capabilities = {
        canManageUsers: hasPermission(role, PERMISSIONS.USER_MANAGEMENT),
        canAccessSystemSettings: hasPermission(role, PERMISSIONS.SYSTEM_SETTINGS),
        canViewAuditLogs: hasPermission(role, PERMISSIONS.AUDIT_LOGS),
        canCreateJobs: hasPermission(role, PERMISSIONS.CREATE_JOBS),
        canAssignJobs: hasPermission(role, PERMISSIONS.ASSIGN_JOBS),
        canApproveJobs: hasPermission(role, PERMISSIONS.APPROVE_JOBS),
        canDefinePayments: hasPermission(role, PERMISSIONS.DEFINE_PAYMENTS),
        canUpdateJobStatus: hasPermission(role, PERMISSIONS.UPDATE_JOB_STATUS),
        canUploadDocuments: hasPermission(role, PERMISSIONS.UPLOAD_DOCUMENTS),
        accessLevel: ACCESS_LEVELS[role] || 'None'
    };

    return capabilities;
}

/**
 * Filter jobs based on user role and permissions
 * @param {array} jobs - Array of job objects
 * @param {object} user - Current user object
 * @returns {array} Filtered jobs
 */
function filterJobsByRole(jobs, user) {
    if (!user || !jobs) return [];

    const role = user.role;

    // Super Admin & Developer: See all jobs
    if (role === ROLES.SUPER_ADMIN || role === ROLES.DEVELOPER) {
        return jobs;
    }

    // Regional Manager: See only jobs in their region
    if (role === ROLES.REGIONAL_MANAGER) {
        return jobs.filter(job => job.region === user.region);
    }

    // Business Support Team: See all jobs (for assignment purposes)
    if (role === ROLES.BUSINESS_SUPPORT) {
        return jobs;
    }

    // Tech-Lead Partner: See only assigned jobs
    if (role === ROLES.TECH_LEAD_PARTNER) {
        return jobs.filter(job => job.assignedTo === user.id);
    }

    return [];
}

// === ROLE CREATION HIERARCHY ===
// Defines which roles each user type can create
const CREATABLE_ROLES = {
    [ROLES.SUPER_ADMIN]: [
        ROLES.DEVELOPER,
        ROLES.REGIONAL_MANAGER,
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.DEVELOPER]: [
        ROLES.REGIONAL_MANAGER,
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.REGIONAL_MANAGER]: [
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.BUSINESS_SUPPORT]: [
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.TECH_LEAD_PARTNER]: []
};

/**
 * Get list of roles that a user can create
 * @param {string} userRole - Current user's role
 * @returns {array} Array of role IDs that can be created
 */
function getCreatableRoles(userRole) {
    return CREATABLE_ROLES[userRole] || [];
}

/**
 * Check if a user can create a specific role
 * @param {string} userRole - Current user's role
 * @param {string} targetRole - Role to be created
 * @returns {boolean}
 */
function canCreateRole(userRole, targetRole) {
    const creatableRoles = getCreatableRoles(userRole);
    return creatableRoles.includes(targetRole);
}

// === USER VISIBILITY RULES ===
// Defines which user roles each role can view in User Management
const VISIBLE_ROLES = {
    [ROLES.SUPER_ADMIN]: [
        ROLES.SUPER_ADMIN,      // Can see themselves
        ROLES.DEVELOPER,
        ROLES.REGIONAL_MANAGER,
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.DEVELOPER]: [
        ROLES.REGIONAL_MANAGER,
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.REGIONAL_MANAGER]: [
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.BUSINESS_SUPPORT]: [
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.TECH_LEAD_PARTNER]: []
};

// Role hierarchy for sorting (lower number = higher priority)
const ROLE_HIERARCHY = {
    [ROLES.SUPER_ADMIN]: 1,
    [ROLES.DEVELOPER]: 2,
    [ROLES.REGIONAL_MANAGER]: 3,
    [ROLES.BUSINESS_SUPPORT]: 4,
    [ROLES.TECH_LEAD_PARTNER]: 5
};

/**
 * Get list of roles that a user can view
 * @param {string} userRole - Current user's role
 * @returns {array} Array of role IDs that can be viewed
 */
function getVisibleRoles(userRole) {
    return VISIBLE_ROLES[userRole] || [];
}

/**
 * Check if a user can view another user based on role
 * @param {string} viewerRole - Viewer's role
 * @param {string} targetRole - Target user's role
 * @returns {boolean}
 */
function canViewUser(viewerRole, targetRole) {
    const visibleRoles = getVisibleRoles(viewerRole);
    return visibleRoles.includes(targetRole);
}

/**
 * Check if a user can edit another user
 * Users can edit users they can view (based on visibility rules)
 * Super Admin can edit their own profile
 * @param {string} editorRole - Editor's role
 * @param {string} targetRole - Target user's role
 * @param {string} targetUserId - Target user's ID
 * @param {string} currentUserId - Current user's ID
 * @returns {boolean}
 */
function canEditUser(editorRole, targetRole, targetUserId, currentUserId) {
    // Super Admin can edit their own profile
    if (editorRole === ROLES.SUPER_ADMIN && targetUserId === currentUserId) {
        return true;
    }

    // Other users cannot edit themselves
    if (targetUserId === currentUserId) {
        return false;
    }

    // Can edit users you can view
    return canViewUser(editorRole, targetRole);
}

/**
 * Check if a user can delete another user
 * Users can delete users they can view (based on visibility rules)
 * Cannot delete yourself
 * @param {string} deleterRole - Deleter's role
 * @param {string} targetRole - Target user's role
 * @param {string} targetUserId - Target user's ID
 * @param {string} currentUserId - Current user's ID
 * @returns {boolean}
 */
function canDeleteUser(deleterRole, targetRole, targetUserId, currentUserId) {
    // Cannot delete yourself
    if (targetUserId === currentUserId) {
        return false;
    }

    // Can delete users you can view
    return canViewUser(deleterRole, targetRole);
}

/**
 * Get role hierarchy level (for sorting)
 * @param {string} role - Role ID
 * @returns {number} Hierarchy level (lower = higher priority)
 */
function getRoleHierarchy(role) {
    return ROLE_HIERARCHY[role] || 999;
}

// === EXPORT ===
window.ROLES = ROLES;
window.ROLE_NAMES = ROLE_NAMES;
window.ROLE_DESCRIPTIONS = ROLE_DESCRIPTIONS;
window.ACCESS_LEVELS = ACCESS_LEVELS;
window.PERMISSIONS = PERMISSIONS;
window.ROLE_HIERARCHY = ROLE_HIERARCHY;
window.hasPermission = hasPermission;
window.canAccess = canAccess;
window.getCurrentUserRole = getCurrentUserRole;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.clearCurrentUser = clearCurrentUser;
window.canViewAllJobs = canViewAllJobs;
window.canViewRegionalJobs = canViewRegionalJobs;
window.canViewAssignedJobs = canViewAssignedJobs;
window.getRoleCapabilities = getRoleCapabilities;
window.filterJobsByRole = filterJobsByRole;
window.getCreatableRoles = getCreatableRoles;
window.canCreateRole = canCreateRole;
window.getVisibleRoles = getVisibleRoles;
window.canViewUser = canViewUser;
window.canEditUser = canEditUser;
window.canDeleteUser = canDeleteUser;
window.getRoleHierarchy = getRoleHierarchy;

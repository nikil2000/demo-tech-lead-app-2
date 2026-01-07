// ===================================
// AUDIT LOGGER
// SLT Tech-Lead Partner Platform
// Tracks all user actions for security and compliance
// ===================================

// === AUDIT LOG TYPES ===
const AUDIT_TYPES = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    SESSION_TIMEOUT: 'session_timeout',
    JOB_CREATE: 'job_create',
    JOB_ASSIGN: 'job_assign',
    JOB_UPDATE: 'job_update',
    JOB_APPROVE: 'job_approve',
    JOB_REJECT: 'job_reject',
    USER_CREATE: 'user_create',
    USER_UPDATE: 'user_update',
    USER_DEACTIVATE: 'user_deactivate',
    PASSWORD_RESET: 'password_reset',
    SYSTEM_SETTINGS: 'system_settings',
    DOCUMENT_UPLOAD: 'document_upload',
    PAYMENT_DEFINE: 'payment_define',
    ACCESS_DENIED: 'access_denied'
};

// === AUDIT LOGGER CLASS ===
class AuditLogger {
    constructor() {
        this.storageKey = 'slt_audit_logs';
        this.maxLogs = 1000; // Keep last 1000 logs
    }

    /**
     * Log an action
     * @param {string} type - Type of action (from AUDIT_TYPES)
     * @param {object} details - Additional details about the action
     */
    log(type, details = {}) {
        const user = getCurrentUser();

        const logEntry = {
            id: this.generateLogId(),
            timestamp: new Date().toISOString(),
            type: type,
            user: user ? {
                id: user.id,
                name: user.name,
                role: user.role
            } : null,
            details: details,
            userAgent: navigator.userAgent,
            ip: 'N/A' // In real app, would be captured server-side
        };

        this.saveLog(logEntry);

        // Also log to console in development
        console.log('[AUDIT]', logEntry);
    }

    /**
     * Save log entry to storage
     * @param {object} logEntry - Log entry to save
     */
    saveLog(logEntry) {
        const logs = this.getAllLogs();
        logs.unshift(logEntry); // Add to beginning

        // Keep only max logs
        if (logs.length > this.maxLogs) {
            logs.splice(this.maxLogs);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(logs));
    }

    /**
     * Get all audit logs
     * @returns {array} Array of log entries
     */
    getAllLogs() {
        const logsJson = localStorage.getItem(this.storageKey);
        return logsJson ? JSON.parse(logsJson) : [];
    }

    /**
     * Get logs filtered by type
     * @param {string} type - Log type to filter
     * @returns {array}
     */
    getLogsByType(type) {
        return this.getAllLogs().filter(log => log.type === type);
    }

    /**
     * Get logs for a specific user
     * @param {string} userId - User ID
     * @returns {array}
     */
    getLogsByUser(userId) {
        return this.getAllLogs().filter(log => log.user && log.user.id === userId);
    }

    /**
     * Get logs within a date range
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {array}
     */
    getLogsByDateRange(startDate, endDate) {
        return this.getAllLogs().filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
        });
    }

    /**
     * Get recent logs
     * @param {number} count - Number of logs to retrieve
     * @returns {array}
     */
    getRecentLogs(count = 50) {
        return this.getAllLogs().slice(0, count);
    }

    /**
     * Clear all logs (Super Admin only)
     */
    clearLogs() {
        if (canAccess(PERMISSIONS.AUDIT_LOGS)) {
            localStorage.removeItem(this.storageKey);
            this.log(AUDIT_TYPES.SYSTEM_SETTINGS, { action: 'clear_audit_logs' });
        }
    }

    /**
     * Generate unique log ID
     * @returns {string}
     */
    generateLogId() {
        return `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Export logs as JSON
     * @returns {string}
     */
    exportLogs() {
        const logs = this.getAllLogs();
        return JSON.stringify(logs, null, 2);
    }

    /**
     * Get formatted log message
     * @param {object} log - Log entry
     * @returns {string}
     */
    getLogMessage(log) {
        const timestamp = new Date(log.timestamp).toLocaleString();
        const userName = log.user ? log.user.name : 'Unknown';
        const userRole = log.user ? log.user.role : 'N/A';

        switch (log.type) {
            case AUDIT_TYPES.LOGIN:
                return `${timestamp} - ${userName} (${userRole}) logged in`;
            case AUDIT_TYPES.LOGOUT:
                return `${timestamp} - ${userName} (${userRole}) logged out`;
            case AUDIT_TYPES.SESSION_TIMEOUT:
                return `${timestamp} - ${userName} (${userRole}) session timed out`;
            case AUDIT_TYPES.JOB_CREATE:
                return `${timestamp} - ${userName} created job ${log.details.jobId}`;
            case AUDIT_TYPES.JOB_ASSIGN:
                return `${timestamp} - ${userName} assigned job ${log.details.jobId} to ${log.details.assignedTo}`;
            case AUDIT_TYPES.JOB_APPROVE:
                return `${timestamp} - ${userName} approved job ${log.details.jobId}`;
            case AUDIT_TYPES.JOB_REJECT:
                return `${timestamp} - ${userName} rejected job ${log.details.jobId}`;
            case AUDIT_TYPES.JOB_UPDATE:
                return `${timestamp} - ${userName} updated job ${log.details.jobId}`;
            case AUDIT_TYPES.USER_CREATE:
                return `${timestamp} - ${userName} created user ${log.details.newUserId}`;
            case AUDIT_TYPES.USER_DEACTIVATE:
                return `${timestamp} - ${userName} deactivated user ${log.details.userId}`;
            case AUDIT_TYPES.PASSWORD_RESET:
                return `${timestamp} - ${userName} reset password for user ${log.details.userId}`;
            case AUDIT_TYPES.DOCUMENT_UPLOAD:
                return `${timestamp} - ${userName} uploaded document for job ${log.details.jobId}`;
            case AUDIT_TYPES.ACCESS_DENIED:
                return `${timestamp} - ${userName} access denied to ${log.details.resource}`;
            default:
                return `${timestamp} - ${userName} performed ${log.type}`;
        }
    }
}

// === CONVENIENCE FUNCTIONS ===

// Create global instance
const auditLogger = new AuditLogger();

/**
 * Quick log function
 * @param {string} type - Audit type
 * @param {object} details - Details object
 */
function logAudit(type, details = {}) {
    auditLogger.log(type, details);
}

/**
 * Log login activity
 * @param {object} user - User object
 */
function logLogin(user) {
    auditLogger.log(AUDIT_TYPES.LOGIN, {
        userId: user.id,
        role: user.role
    });
}

/**
 * Log logout activity
 */
function logLogout() {
    auditLogger.log(AUDIT_TYPES.LOGOUT, {});
}

/**
 * Log session timeout
 */
function logSessionTimeout() {
    auditLogger.log(AUDIT_TYPES.SESSION_TIMEOUT, {});
}

/**
 * Log job action
 * @param {string} action - Action type (create, assign, approve, reject, update)
 * @param {string} jobId - Job ID
 * @param {object} additionalDetails - Additional details
 */
function logJobAction(action, jobId, additionalDetails = {}) {
    const typeMap = {
        'create': AUDIT_TYPES.JOB_CREATE,
        'assign': AUDIT_TYPES.JOB_ASSIGN,
        'approve': AUDIT_TYPES.JOB_APPROVE,
        'reject': AUDIT_TYPES.JOB_REJECT,
        'update': AUDIT_TYPES.JOB_UPDATE
    };

    const type = typeMap[action] || AUDIT_TYPES.JOB_UPDATE;
    auditLogger.log(type, { jobId, ...additionalDetails });
}

/**
 * Log user management action
 * @param {string} action - Action type (create, update, deactivate, password_reset)
 * @param {string} userId - Target user ID
 * @param {object} additionalDetails - Additional details
 */
function logUserAction(action, userId, additionalDetails = {}) {
    const typeMap = {
        'create': AUDIT_TYPES.USER_CREATE,
        'update': AUDIT_TYPES.USER_UPDATE,
        'deactivate': AUDIT_TYPES.USER_DEACTIVATE,
        'password_reset': AUDIT_TYPES.PASSWORD_RESET
    };

    const type = typeMap[action] || AUDIT_TYPES.USER_UPDATE;
    auditLogger.log(type, { userId, ...additionalDetails });
}

/**
 * Log access denied
 * @param {string} resource - Resource that was denied
 */
function logAccessDenied(resource) {
    auditLogger.log(AUDIT_TYPES.ACCESS_DENIED, { resource });
}

// === EXPORT ===
window.AUDIT_TYPES = AUDIT_TYPES;
window.auditLogger = auditLogger;
window.logAudit = logAudit;
window.logLogin = logLogin;
window.logLogout = logLogout;
window.logSessionTimeout = logSessionTimeout;
window.logJobAction = logJobAction;
window.logUserAction = logUserAction;
window.logAccessDenied = logAccessDenied;

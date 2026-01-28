// Script to create test users for role-based visibility testing
// Run this in the browser console on admin-dashboard.html

// Load permissions if not already loaded
if (typeof ROLES === 'undefined') {
    console.error('ROLES not defined. Make sure permissions.js is loaded.');
} else {
    const testUsers = [
        // Super Admins
        {
            id: 'USER-SA-001',
            username: 'superadmin1',
            name: 'Super Admin One',
            email: 'superadmin1@slt.lk',
            password: 'admin123',
            role: ROLES.SUPER_ADMIN,
            region: null,
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },
        {
            id: 'USER-SA-002',
            username: 'superadmin2',
            name: 'Super Admin Two',
            email: 'superadmin2@slt.lk',
            password: 'admin123',
            role: ROLES.SUPER_ADMIN,
            region: null,
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },

        // Developers
        {
            id: 'USER-DEV-001',
            username: 'developer1',
            name: 'Developer One',
            email: 'dev1@slt.lk',
            password: 'dev123',
            role: ROLES.DEVELOPER,
            region: null,
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },
        {
            id: 'USER-DEV-002',
            username: 'developer2',
            name: 'Developer Two',
            email: 'dev2@slt.lk',
            password: 'dev123',
            role: ROLES.DEVELOPER,
            region: null,
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },

        // Regional Managers
        {
            id: 'USER-RM-001',
            username: 'rm1',
            name: 'Regional Manager One',
            email: 'rm1@slt.lk',
            password: 'rm123',
            role: ROLES.REGIONAL_MANAGER,
            region: 'Western Province',
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },
        {
            id: 'USER-RM-002',
            username: 'rm2',
            name: 'Regional Manager Two',
            email: 'rm2@slt.lk',
            password: 'rm123',
            role: ROLES.REGIONAL_MANAGER,
            region: 'Central Province',
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },

        // Business Support Team
        {
            id: 'USER-BST-001',
            username: 'bst1',
            name: 'Business Support One',
            email: 'bst1@slt.lk',
            password: 'bst123',
            role: ROLES.BUSINESS_SUPPORT,
            region: 'Western Province',
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },
        {
            id: 'USER-BST-002',
            username: 'bst2',
            name: 'Business Support Two',
            email: 'bst2@slt.lk',
            password: 'bst123',
            role: ROLES.BUSINESS_SUPPORT,
            region: 'Central Province',
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },

        // Tech Lead Partners
        {
            id: 'USER-TL-001',
            username: 'techlead1',
            name: 'Tech Lead One',
            email: 'tl1@slt.lk',
            password: 'tl123',
            role: ROLES.TECH_LEAD_PARTNER,
            region: 'Western Province',
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        },
        {
            id: 'USER-TL-002',
            username: 'techlead2',
            name: 'Tech Lead Two',
            email: 'tl2@slt.lk',
            password: 'tl123',
            role: ROLES.TECH_LEAD_PARTNER,
            region: 'Central Province',
            createdBy: 'SYSTEM',
            createdAt: new Date().toISOString()
        }
    ];

    // Save to localStorage
    localStorage.setItem('platformUsers', JSON.stringify(testUsers));

    console.log('✅ Test users created successfully!');
    console.log('\n📋 Test User Credentials:\n');
    console.log('Super Admin 1: username=superadmin1, password=admin123');
    console.log('Super Admin 2: username=superadmin2, password=admin123');
    console.log('Developer 1: username=developer1, password=dev123');
    console.log('Developer 2: username=developer2, password=dev123');
    console.log('Regional Manager 1: username=rm1, password=rm123');
    console.log('Regional Manager 2: username=rm2, password=rm123');
    console.log('Business Support 1: username=bst1, password=bst123');
    console.log('Business Support 2: username=bst2, password=bst123');
    console.log('Tech Lead 1: username=techlead1, password=tl123');
    console.log('Tech Lead 2: username=techlead2, password=tl123');
    console.log('\n🔄 Refresh the page and login with any of these credentials to test visibility.');
}

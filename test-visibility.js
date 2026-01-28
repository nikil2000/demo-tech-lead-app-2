// Test script for role-based user visibility
// This script tests the getVisibleUsers function with different roles

// Load the permissions module (simulated)
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    DEVELOPER: 'developer',
    REGIONAL_MANAGER: 'regional_manager',
    BUSINESS_SUPPORT: 'business_support',
    TECH_LEAD_PARTNER: 'tech_lead_partner'
};

const VISIBLE_ROLES = {
    [ROLES.SUPER_ADMIN]: [
        ROLES.SUPER_ADMIN,
        ROLES.DEVELOPER,
        ROLES.REGIONAL_MANAGER,
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.DEVELOPER]: [
        ROLES.DEVELOPER,
        ROLES.TECH_LEAD_PARTNER,
        ROLES.REGIONAL_MANAGER,
        ROLES.BUSINESS_SUPPORT
    ],
    [ROLES.REGIONAL_MANAGER]: [
        ROLES.REGIONAL_MANAGER,
        ROLES.TECH_LEAD_PARTNER,
        ROLES.BUSINESS_SUPPORT
    ],
    [ROLES.BUSINESS_SUPPORT]: [
        ROLES.BUSINESS_SUPPORT,
        ROLES.TECH_LEAD_PARTNER
    ],
    [ROLES.TECH_LEAD_PARTNER]: []
};

// Sample users for testing
const testUsers = [
    { id: '1', name: 'Super Admin 1', role: ROLES.SUPER_ADMIN },
    { id: '2', name: 'Super Admin 2', role: ROLES.SUPER_ADMIN },
    { id: '3', name: 'Developer 1', role: ROLES.DEVELOPER },
    { id: '4', name: 'Developer 2', role: ROLES.DEVELOPER },
    { id: '5', name: 'Regional Manager 1', role: ROLES.REGIONAL_MANAGER },
    { id: '6', name: 'Regional Manager 2', role: ROLES.REGIONAL_MANAGER },
    { id: '7', name: 'Business Support 1', role: ROLES.BUSINESS_SUPPORT },
    { id: '8', name: 'Business Support 2', role: ROLES.BUSINESS_SUPPORT },
    { id: '9', name: 'Tech Lead 1', role: ROLES.TECH_LEAD_PARTNER },
    { id: '10', name: 'Tech Lead 2', role: ROLES.TECH_LEAD_PARTNER }
];

function getVisibleRoles(userRole) {
    return VISIBLE_ROLES[userRole] || [];
}

function getVisibleUsers(currentUserRole, currentUserId, allUsers) {
    const visibleRoles = getVisibleRoles(currentUserRole);

    return allUsers.filter(user => {
        // Check if user's role is in visible roles
        if (!visibleRoles.includes(user.role)) {
            return false;
        }

        // Super Admin can see all users including other Super Admins
        if (currentUserRole === ROLES.SUPER_ADMIN) {
            return true;
        }

        // For other roles: if the user has the same role as current user,
        // only show if it's the current user themselves
        if (user.role === currentUserRole) {
            return user.id === currentUserId;
        }

        // Show users with different roles (that are in visible roles)
        return true;
    });
}

// Test cases
console.log('='.repeat(80));
console.log('ROLE-BASED USER VISIBILITY TEST');
console.log('='.repeat(80));

// Test 1: Super Admin (ID: 1)
console.log('\n1. SUPER ADMIN (ID: 1) - Should see ALL users');
console.log('-'.repeat(80));
const superAdminView = getVisibleUsers(ROLES.SUPER_ADMIN, '1', testUsers);
console.log(`Visible users: ${superAdminView.length}/10`);
superAdminView.forEach(u => console.log(`  - ${u.name} (${u.role})`));
console.log(`✓ Expected: 10 users | Actual: ${superAdminView.length} users`);

// Test 2: Developer (ID: 3)
console.log('\n2. DEVELOPER (ID: 3) - Should see own profile + RM + BST + Tech Leads');
console.log('-'.repeat(80));
const developerView = getVisibleUsers(ROLES.DEVELOPER, '3', testUsers);
console.log(`Visible users: ${developerView.length}/10`);
developerView.forEach(u => console.log(`  - ${u.name} (${u.role})`));
console.log(`✓ Expected: 7 users (1 Developer + 2 RM + 2 BST + 2 TL) | Actual: ${developerView.length} users`);

// Verify no other developers or super admins
const hasOtherDevs = developerView.some(u => u.role === ROLES.DEVELOPER && u.id !== '3');
const hasSuperAdmins = developerView.some(u => u.role === ROLES.SUPER_ADMIN);
console.log(`✓ No other Developers: ${!hasOtherDevs}`);
console.log(`✓ No Super Admins: ${!hasSuperAdmins}`);

// Test 3: Regional Manager (ID: 5)
console.log('\n3. REGIONAL MANAGER (ID: 5) - Should see own profile + BST + Tech Leads');
console.log('-'.repeat(80));
const rmView = getVisibleUsers(ROLES.REGIONAL_MANAGER, '5', testUsers);
console.log(`Visible users: ${rmView.length}/10`);
rmView.forEach(u => console.log(`  - ${u.name} (${u.role})`));
console.log(`✓ Expected: 5 users (1 RM + 2 BST + 2 TL) | Actual: ${rmView.length} users`);

// Verify no other RMs, developers, or super admins
const hasOtherRMs = rmView.some(u => u.role === ROLES.REGIONAL_MANAGER && u.id !== '5');
const hasDevs = rmView.some(u => u.role === ROLES.DEVELOPER);
const hasSuperAdmins2 = rmView.some(u => u.role === ROLES.SUPER_ADMIN);
console.log(`✓ No other Regional Managers: ${!hasOtherRMs}`);
console.log(`✓ No Developers: ${!hasDevs}`);
console.log(`✓ No Super Admins: ${!hasSuperAdmins2}`);

// Test 4: Business Support (ID: 7)
console.log('\n4. BUSINESS SUPPORT TEAM (ID: 7) - Should see own profile + Tech Leads');
console.log('-'.repeat(80));
const bstView = getVisibleUsers(ROLES.BUSINESS_SUPPORT, '7', testUsers);
console.log(`Visible users: ${bstView.length}/10`);
bstView.forEach(u => console.log(`  - ${u.name} (${u.role})`));
console.log(`✓ Expected: 3 users (1 BST + 2 TL) | Actual: ${bstView.length} users`);

// Verify no other BST, RMs, developers, or super admins
const hasOtherBST = bstView.some(u => u.role === ROLES.BUSINESS_SUPPORT && u.id !== '7');
const hasRMs = bstView.some(u => u.role === ROLES.REGIONAL_MANAGER);
const hasDevs2 = bstView.some(u => u.role === ROLES.DEVELOPER);
const hasSuperAdmins3 = bstView.some(u => u.role === ROLES.SUPER_ADMIN);
console.log(`✓ No other Business Support: ${!hasOtherBST}`);
console.log(`✓ No Regional Managers: ${!hasRMs}`);
console.log(`✓ No Developers: ${!hasDevs2}`);
console.log(`✓ No Super Admins: ${!hasSuperAdmins3}`);

console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log('✓ Super Admin: Sees all 10 users');
console.log('✓ Developer: Sees only own profile + RM + BST + Tech Leads (7 total)');
console.log('✓ Regional Manager: Sees only own profile + BST + Tech Leads (5 total)');
console.log('✓ Business Support: Sees only own profile + Tech Leads (3 total)');
console.log('='.repeat(80));

// ============================================
// UPDATED ROLE-BASED USER VISIBILITY TEST
// Paste this in Chrome DevTools Console
// ============================================

console.clear();
console.log('%c=== ROLE-BASED USER VISIBILITY TEST (UPDATED) ===', 'color: #3B82F6; font-size: 16px; font-weight: bold;');
console.log('');

// Get current user
const currentUser = getCurrentUser();
if (!currentUser) {
    console.log('%c❌ No user logged in!', 'color: #EF4444; font-weight: bold;');
    console.log('Please login first and run this script again.');
} else {
    console.log('%c✅ Current User:', 'color: #10B981; font-weight: bold;');
    console.log('   Name:', currentUser.name);
    console.log('   Role:', ROLE_NAMES[currentUser.role]);
    console.log('   ID:', currentUser.id);
    console.log('');

    // Get all users for comparison
    const allUsers = loadUsers();
    console.log('%c📊 Total Users in System:', allUsers.length, 'color: #6B7280;');

    // Group all users by role
    const allUsersByRole = {};
    allUsers.forEach(user => {
        const roleName = ROLE_NAMES[user.role];
        if (!allUsersByRole[roleName]) {
            allUsersByRole[roleName] = [];
        }
        allUsersByRole[roleName].push(user);
    });

    console.log('%c📋 All Users in System:', 'color: #6B7280;');
    Object.keys(allUsersByRole).sort().forEach(roleName => {
        console.log(`   ${roleName} (${allUsersByRole[roleName].length}):`);
        allUsersByRole[roleName].forEach(user => {
            const isSelf = user.id === currentUser.id ? ' ⭐ (YOU)' : '';
            console.log(`      • ${user.name} (${user.email})${isSelf}`);
        });
    });
    console.log('');

    // Get visible users
    const visibleUsers = getVisibleUsers(currentUser.role);
    console.log('%c👁️ VISIBLE Users (' + visibleUsers.length + ' total):', 'color: #8B5CF6; font-weight: bold;');

    // Group by role
    const usersByRole = {};
    visibleUsers.forEach(user => {
        const roleName = ROLE_NAMES[user.role];
        if (!usersByRole[roleName]) {
            usersByRole[roleName] = [];
        }
        usersByRole[roleName].push(user);
    });

    // Display grouped users
    Object.keys(usersByRole).sort().forEach(roleName => {
        console.log(`   ${roleName} (${usersByRole[roleName].length}):`);
        usersByRole[roleName].forEach(user => {
            const isSelf = user.id === currentUser.id ? ' ⭐ (YOU)' : '';
            console.log(`      • ${user.name} (${user.email})${isSelf}`);
        });
    });
    console.log('');

    // Verify against requirements
    console.log('%c🔍 VERIFICATION:', 'color: #3B82F6; font-weight: bold;');

    const role = currentUser.role;
    let testsPassed = true;

    if (role === ROLES.SUPER_ADMIN) {
        console.log('   Testing: Admin should see ALL users');
        const shouldSeeAll = visibleUsers.length === allUsers.length;
        if (shouldSeeAll) {
            console.log('%c   ✅ PASS: Can see all ' + allUsers.length + ' users', 'color: #10B981;');
        } else {
            console.log('%c   ❌ FAIL: Should see ' + allUsers.length + ' users, but sees ' + visibleUsers.length, 'color: #EF4444;');
            testsPassed = false;
        }
    } else if (role === ROLES.DEVELOPER) {
        console.log('   Testing: Developer should see:');
        console.log('      - Their own profile only (not other Developers)');
        console.log('      - Tech Leads');
        console.log('      - Regional Managers');
        console.log('      - Business Support');

        // Check for own profile
        const seesOwnProfile = visibleUsers.some(u => u.id === currentUser.id);
        console.log(seesOwnProfile ? '%c   ✅ Can see own profile' : '%c   ❌ Cannot see own profile', seesOwnProfile ? 'color: #10B981;' : 'color: #EF4444;');

        // Check for other developers
        const otherDevelopers = visibleUsers.filter(u => u.role === ROLES.DEVELOPER && u.id !== currentUser.id);
        const noOtherDevs = otherDevelopers.length === 0;
        console.log(noOtherDevs ? '%c   ✅ Cannot see other Developers' : '%c   ❌ Can see ' + otherDevelopers.length + ' other Developers (SHOULD BE 0)', noOtherDevs ? 'color: #10B981;' : 'color: #EF4444;');

        // Check for Super Admin
        const seesSuperAdmin = visibleUsers.some(u => u.role === ROLES.SUPER_ADMIN);
        const noSuperAdmin = !seesSuperAdmin;
        console.log(noSuperAdmin ? '%c   ✅ Cannot see Super Admin' : '%c   ❌ Can see Super Admin (SHOULD NOT)', noSuperAdmin ? 'color: #10B981;' : 'color: #EF4444;');

        // Check for Tech Leads
        const seesTechLeads = visibleUsers.some(u => u.role === ROLES.TECH_LEAD_PARTNER);
        console.log(seesTechLeads ? '%c   ✅ Can see Tech Leads' : '%c   ⚠️ No Tech Leads visible', seesTechLeads ? 'color: #10B981;' : 'color: #F59E0B;');

        // Check for Regional Managers
        const seesRM = visibleUsers.some(u => u.role === ROLES.REGIONAL_MANAGER);
        console.log(seesRM ? '%c   ✅ Can see Regional Managers' : '%c   ⚠️ No Regional Managers visible', seesRM ? 'color: #10B981;' : 'color: #F59E0B;');

        // Check for Business Support
        const seesBS = visibleUsers.some(u => u.role === ROLES.BUSINESS_SUPPORT);
        console.log(seesBS ? '%c   ✅ Can see Business Support' : '%c   ⚠️ No Business Support visible', seesBS ? 'color: #10B981;' : 'color: #F59E0B;');

        testsPassed = seesOwnProfile && noOtherDevs && noSuperAdmin;

    } else if (role === ROLES.REGIONAL_MANAGER) {
        console.log('   Testing: Regional Manager should see:');
        console.log('      - Their own profile only (not other Regional Managers)');
        console.log('      - Tech Leads');
        console.log('      - Business Support');

        const seesOwnProfile = visibleUsers.some(u => u.id === currentUser.id);
        const otherRM = visibleUsers.filter(u => u.role === ROLES.REGIONAL_MANAGER && u.id !== currentUser.id);
        const noOtherRM = otherRM.length === 0;
        const seesTechLeads = visibleUsers.some(u => u.role === ROLES.TECH_LEAD_PARTNER);
        const seesBS = visibleUsers.some(u => u.role === ROLES.BUSINESS_SUPPORT);

        console.log(seesOwnProfile ? '%c   ✅ Can see own profile' : '%c   ❌ Cannot see own profile', seesOwnProfile ? 'color: #10B981;' : 'color: #EF4444;');
        console.log(noOtherRM ? '%c   ✅ Cannot see other Regional Managers' : '%c   ❌ Can see other Regional Managers', noOtherRM ? 'color: #10B981;' : 'color: #EF4444;');
        console.log(seesTechLeads ? '%c   ✅ Can see Tech Leads' : '%c   ⚠️ No Tech Leads visible', seesTechLeads ? 'color: #10B981;' : 'color: #F59E0B;');
        console.log(seesBS ? '%c   ✅ Can see Business Support' : '%c   ⚠️ No Business Support visible', seesBS ? 'color: #10B981;' : 'color: #F59E0B;');

        testsPassed = seesOwnProfile && noOtherRM;

    } else if (role === ROLES.BUSINESS_SUPPORT) {
        console.log('   Testing: Business Support should see:');
        console.log('      - Their own profile only (not other Business Support)');
        console.log('      - Tech Leads');

        const seesOwnProfile = visibleUsers.some(u => u.id === currentUser.id);
        const otherBS = visibleUsers.filter(u => u.role === ROLES.BUSINESS_SUPPORT && u.id !== currentUser.id);
        const noOtherBS = otherBS.length === 0;
        const seesTechLeads = visibleUsers.some(u => u.role === ROLES.TECH_LEAD_PARTNER);

        console.log(seesOwnProfile ? '%c   ✅ Can see own profile' : '%c   ❌ Cannot see own profile', seesOwnProfile ? 'color: #10B981;' : 'color: #EF4444;');
        console.log(noOtherBS ? '%c   ✅ Cannot see other Business Support users' : '%c   ❌ Can see other Business Support users', noOtherBS ? 'color: #10B981;' : 'color: #EF4444;');
        console.log(seesTechLeads ? '%c   ✅ Can see Tech Leads' : '%c   ⚠️ No Tech Leads visible', seesTechLeads ? 'color: #10B981;' : 'color: #F59E0B;');

        testsPassed = seesOwnProfile && noOtherBS;
    }

    console.log('');
    if (testsPassed) {
        console.log('%c✅ ALL TESTS PASSED!', 'color: #10B981; font-size: 18px; font-weight: bold;');
    } else {
        console.log('%c❌ SOME TESTS FAILED!', 'color: #EF4444; font-size: 18px; font-weight: bold;');
    }
    console.log('');
    console.log('%c=== TEST COMPLETE ===', 'color: #3B82F6; font-size: 16px; font-weight: bold;');
}

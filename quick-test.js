// ============================================
// QUICK PERMISSION TEST - RUN IN CONSOLE
// ============================================

console.clear();
console.log('%c🧪 TESTING ROLE-BASED PERMISSIONS', 'color: #3B82F6; font-size: 18px; font-weight: bold;');
console.log('');

// Check if user is logged in
const currentUser = getCurrentUser();
if (!currentUser) {
    console.log('%c❌ NOT LOGGED IN', 'color: #EF4444; font-size: 16px; font-weight: bold;');
    console.log('Please login first, then run this script again.');
} else {
    console.log('%c✅ LOGGED IN AS:', 'color: #10B981; font-weight: bold;');
    console.log('   Name:', currentUser.name);
    console.log('   Role:', ROLE_NAMES[currentUser.role]);
    console.log('');

    // Get all users
    const allUsers = loadUsers();
    console.log('%c📊 TOTAL USERS IN SYSTEM:', allUsers.length, 'color: #6B7280; font-weight: bold;');
    allUsers.forEach(u => {
        console.log(`   • ${u.name} (${ROLE_NAMES[u.role]})`);
    });
    console.log('');

    // Get visible users
    const visibleUsers = getVisibleUsers(currentUser.role);
    console.log('%c👁️ VISIBLE TO YOU:', visibleUsers.length, 'color: #8B5CF6; font-weight: bold;');
    visibleUsers.forEach(u => {
        const isSelf = u.id === currentUser.id ? ' ⭐ (YOU)' : '';
        console.log(`   • ${u.name} (${ROLE_NAMES[u.role]})${isSelf}`);
    });
    console.log('');

    // Test based on role
    if (currentUser.role === ROLES.DEVELOPER) {
        console.log('%c🔍 DEVELOPER TESTS:', 'color: #F59E0B; font-weight: bold;');

        const seesOwnProfile = visibleUsers.some(u => u.id === currentUser.id);
        const otherDevs = visibleUsers.filter(u => u.role === ROLES.DEVELOPER && u.id !== currentUser.id);
        const seesSuperAdmin = visibleUsers.some(u => u.role === ROLES.SUPER_ADMIN);
        const seesTL = visibleUsers.some(u => u.role === ROLES.TECH_LEAD_PARTNER);
        const seesRM = visibleUsers.some(u => u.role === ROLES.REGIONAL_MANAGER);
        const seesBS = visibleUsers.some(u => u.role === ROLES.BUSINESS_SUPPORT);

        console.log(seesOwnProfile ? '   ✅ Can see own profile' : '   ❌ FAIL: Cannot see own profile');
        console.log(otherDevs.length === 0 ? '   ✅ Cannot see other Developers' : `   ❌ FAIL: Can see ${otherDevs.length} other Developers`);
        console.log(!seesSuperAdmin ? '   ✅ Cannot see Super Admin' : '   ❌ FAIL: Can see Super Admin');
        console.log(seesTL ? '   ✅ Can see Tech Leads' : '   ⚠️ No Tech Leads in system');
        console.log(seesRM ? '   ✅ Can see Regional Managers' : '   ⚠️ No Regional Managers in system');
        console.log(seesBS ? '   ✅ Can see Business Support' : '   ⚠️ No Business Support in system');

        const allPass = seesOwnProfile && otherDevs.length === 0 && !seesSuperAdmin;
        console.log('');
        if (allPass) {
            console.log('%c✅ ALL DEVELOPER TESTS PASSED!', 'color: #10B981; font-size: 16px; font-weight: bold;');
        } else {
            console.log('%c❌ SOME TESTS FAILED!', 'color: #EF4444; font-size: 16px; font-weight: bold;');
        }
    } else if (currentUser.role === ROLES.SUPER_ADMIN) {
        console.log('%c🔍 ADMIN TEST:', 'color: #F59E0B; font-weight: bold;');
        const seesAll = visibleUsers.length === allUsers.length;
        console.log(seesAll ? '   ✅ Can see ALL users' : `   ❌ FAIL: Sees ${visibleUsers.length}/${allUsers.length} users`);
        console.log('');
        if (seesAll) {
            console.log('%c✅ ADMIN TEST PASSED!', 'color: #10B981; font-size: 16px; font-weight: bold;');
        } else {
            console.log('%c❌ TEST FAILED!', 'color: #EF4444; font-size: 16px; font-weight: bold;');
        }
    }
}

console.log('');
console.log('%c=== TEST COMPLETE ===', 'color: #3B82F6; font-size: 16px; font-weight: bold;');

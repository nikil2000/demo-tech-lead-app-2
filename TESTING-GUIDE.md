# Role-Based Visibility Testing Guide

Since the browser environment is currently unavailable, please follow these manual testing steps:

## Step 1: Create Test Users

1. Open `admin-dashboard.html` in your Chrome browser
2. Open the browser console (F12 or Ctrl+Shift+I)
3. Copy and paste the contents of `create-test-users.js` into the console
4. Press Enter to execute the script
5. You should see a success message with all test user credentials

## Step 2: Test Each Role's Visibility

### Test 1: Super Admin Visibility
**Login as**: `superadmin1` / `admin123`

**Expected to see in User Management**:
- ✅ Super Admin One (self)
- ✅ Super Admin Two
- ✅ Developer One
- ✅ Developer Two
- ✅ Regional Manager One
- ✅ Regional Manager Two
- ✅ Business Support One
- ✅ Business Support Two
- ✅ Tech Lead One
- ✅ Tech Lead Two

**Total**: 10 users (ALL users)

---

### Test 2: Developer Visibility
**Login as**: `developer1` / `dev123`

**Expected to see in User Management**:
- ✅ Developer One (self only)
- ❌ Developer Two (should NOT see other developers)
- ✅ Regional Manager One
- ✅ Regional Manager Two
- ✅ Business Support One
- ✅ Business Support Two
- ✅ Tech Lead One
- ✅ Tech Lead Two
- ❌ Super Admin One (should NOT see)
- ❌ Super Admin Two (should NOT see)

**Total**: 7 users (self + regional managers + business support + tech leads)

---

### Test 3: Regional Manager Visibility
**Login as**: `rm1` / `rm123`

**Expected to see in User Management**:
- ✅ Regional Manager One (self only)
- ❌ Regional Manager Two (should NOT see other regional managers)
- ✅ Business Support One
- ✅ Business Support Two
- ✅ Tech Lead One
- ✅ Tech Lead Two
- ❌ Developer One (should NOT see)
- ❌ Developer Two (should NOT see)
- ❌ Super Admin One (should NOT see)
- ❌ Super Admin Two (should NOT see)

**Total**: 5 users (self + business support + tech leads)

---

### Test 4: Business Support Team Visibility
**Login as**: `bst1` / `bst123`

**Expected to see in User Management**:
- ✅ Business Support One (self only)
- ❌ Business Support Two (should NOT see other business support members)
- ✅ Tech Lead One
- ✅ Tech Lead Two
- ❌ Regional Manager One (should NOT see)
- ❌ Regional Manager Two (should NOT see)
- ❌ Developer One (should NOT see)
- ❌ Developer Two (should NOT see)
- ❌ Super Admin One (should NOT see)
- ❌ Super Admin Two (should NOT see)

**Total**: 3 users (self + tech leads)

---

## Verification Checklist

For each role test above:

1. [ ] Login with the specified credentials
2. [ ] Navigate to "User Management" section
3. [ ] Count the total number of user cards displayed
4. [ ] Verify each expected user is visible
5. [ ] Verify each user that should NOT be visible is indeed hidden
6. [ ] Take a screenshot of the User Management page
7. [ ] Logout

## Expected Results Summary

| Role | Total Users Visible | Can See Own Role | Can See Other Same Role |
|------|-------------------|------------------|------------------------|
| Super Admin | 10 | ✅ Yes | ✅ Yes (all) |
| Developer | 7 | ✅ Yes (self only) | ❌ No |
| Regional Manager | 5 | ✅ Yes (self only) | ❌ No |
| Business Support | 3 | ✅ Yes (self only) | ❌ No |

## Reporting Issues

If any test fails:
1. Note which role you were testing
2. Note which users were incorrectly shown or hidden
3. Take a screenshot
4. Report the discrepancy

## Notes

- The visibility rules are defined in `permissions.js` in the `VISIBLE_ROLES` constant
- The filtering logic is implemented in `admin-dashboard-script.js` in the `getVisibleUsers()` function
- Each non-Super Admin role can only see their own profile, not other users with the same role

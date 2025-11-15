# Smart Hostel Power Monitoring System - Login Flow Guide

## 🔐 Role-Based Authentication System

The Smart Hostel Power Monitoring System uses email-based role detection to automatically route users to the appropriate dashboard after login.

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     LOGIN SCREEN                        │
│                                                         │
│  User enters:                                           │
│  • Email address                                        │
│  • Password                                             │
│                                                         │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              EMAIL DOMAIN DETECTION                     │
│                                                         │
│  System checks email for role identifiers:             │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │  Contains "@admin"  →  Admin Role            │      │
│  │  Contains "@hr"     →  HR Role               │      │
│  │  Other formats      →  Warden Role           │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└───────────┬───────────┬───────────┬─────────────────────┘
            │           │           │
    ┌───────▼─────┐ ┌──▼────┐ ┌────▼──────┐
    │   @admin    │ │  @hr  │ │   Other   │
    └───────┬─────┘ └──┬────┘ └────┬──────┘
            │          │           │
            ▼          ▼           ▼
┌─────────────────┐ ┌─────────────┐ ┌──────────────────┐
│ ADMIN DASHBOARD │ │HR DASHBOARD │ │ WARDEN DASHBOARD │
│                 │ │             │ │                  │
│ • User Mgmt     │ │ • Reports   │ │ • Room Monitor   │
│ • Accounts      │ │ • Analytics │ │ • Alerts         │
│ • Activity Log  │ │ • Export    │ │ • Usage Stats    │
│                 │ │             │ │                  │
└─────────────────┘ └─────────────┘ └──────────────────┘
```

---

## 👥 User Roles & Access

### 1. **Admin Role** 👨‍💼
- **Email Pattern**: Must contain `@admin` (e.g., `user@admin.com`, `manager@admin.edu`)
- **Dashboard**: Admin Management Dashboard
- **Capabilities**:
  - ✅ Manage warden accounts (Create, Read, Update, Delete)
  - ✅ View system statistics (Total Wardens, Active Wardens, Total Alerts, Total Rooms)
  - ✅ Monitor system activity logs
  - ✅ Add new user accounts (Warden/HR roles)
  - ✅ Enable/Disable user accounts
  - ✅ Search and filter activities

### 2. **HR Role** 📊
- **Email Pattern**: Must contain `@hr` (e.g., `officer@hr.com`, `staff@hr.edu`)
- **Dashboard**: HR Reports Dashboard
- **Capabilities**:
  - ✅ Generate power usage reports (All Rooms or Specific Room)
  - ✅ View energy consumption analytics
  - ✅ Export reports to PDF
  - ✅ View usage charts and trends
  - ✅ Track highest usage rooms
  - ✅ Monitor rooms under alert
  - ✅ Access report generation history

### 3. **Warden Role** 🏠
- **Email Pattern**: Any other email format (e.g., `warden@hostel.edu`, `john@example.com`)
- **Dashboard**: Standard Warden Dashboard
- **Capabilities**:
  - ✅ Monitor real-time room power usage
  - ✅ View and manage alerts
  - ✅ Access room details
  - ✅ View usage reports
  - ✅ Control room power (on/off)
  - ✅ Track daily usage patterns

---

## 🔄 Login Process Flow

### Step 1: User Login
1. User opens the application
2. After splash screen, login screen is displayed
3. User enters email and password
4. User clicks "Sign In" button

### Step 2: Email Analysis
```javascript
// System determines role based on email
function determineUserRole(email: string): UserRole {
  const emailLower = email.toLowerCase();
  if (emailLower.includes('@admin')) {
    return 'admin';
  } else if (emailLower.includes('@hr')) {
    return 'hr';
  } else {
    return 'warden';
  }
}
```

### Step 3: Routing
- **Admin users** → Redirected to Admin Dashboard
- **HR users** → Redirected to HR Dashboard
- **Warden users** → Redirected to Standard Dashboard

### Step 4: Context Storage
- User role stored in AppContext
- User email stored in AppContext
- Role persists throughout session
- Displayed in dashboard headers

---

## 📝 Example Login Credentials

### Admin Login Examples:
```
Email: admin@admin.com
Email: manager@admin.edu
Email: john.doe@admin.hostel
```

### HR Login Examples:
```
Email: officer@hr.com
Email: hrstaff@hr.edu
Email: reports@hr.hostel
```

### Warden Login Examples:
```
Email: warden@hostel.edu
Email: ahmad.ali@hostel.edu
Email: john.smith@example.com
```

> **Note**: Password can be any value for demonstration purposes

---

## 🎨 Visual Indicators

### Login Screen
- **Hint Box**: Displays at top of login form
  - "💡 Use @admin for Admin Dashboard, @hr for HR Dashboard"
  - Available in English, Malay, and Chinese

### Dashboard Headers
- **User Info Display**: Shows logged-in user
  - Format: "Logged in as: [email]"
  - Appears below dashboard title
  - Color-coded by role

---

## 🔒 Security Features

1. **Role-based Access Control**: Users can only access dashboards appropriate to their role
2. **Session Management**: Role persists throughout user session
3. **Logout**: Clears role and email, returns to login screen
4. **Protected Routes**: Dashboards only accessible when logged in

---

## 🌐 Multi-Language Support

The login flow and all role indicators support:
- 🇬🇧 English
- 🇲🇾 Malay (Bahasa Malaysia)
- 🇨🇳 Chinese (中文)

Language selection available in Settings screen.

---

## 🎯 Navigation Flow

### From Admin/HR Dashboards:
```
Admin/HR Dashboard
    ↓
Settings (via bottom nav or back button)
    ↓
Edit Profile / Change Password
    ↓
Back to Admin/HR Dashboard (maintains role context)
```

### From Warden Dashboard:
```
Warden Dashboard
    ↓
Rooms / Alerts / Reports / Settings
    ↓
Room Details / Edit Profile / etc.
    ↓
Back to Warden Dashboard
```

---

## 🛠️ Technical Implementation

### Key Files:
- `/lib/AppContext.tsx` - Role and email state management
- `/components/LoginScreen.tsx` - Email detection logic
- `/App.tsx` - Route handling based on role
- `/components/AdminDashboard.tsx` - Admin interface
- `/components/HRDashboard.tsx` - HR interface
- `/components/DashboardScreen.tsx` - Warden interface

### State Management:
```typescript
interface AppContextType {
  userRole: 'admin' | 'hr' | 'warden' | null;
  userEmail: string;
  setUserRole: (role: UserRole | null) => void;
  setUserEmail: (email: string) => void;
  // ... other properties
}
```

---

## 📱 User Experience

### Login Instructions Displayed:
- Clear hint on login screen
- Examples of email formats
- Multi-language support
- Visual confirmation after login (email shown in header)

### Seamless Navigation:
- Appropriate back button behavior
- Bottom navigation hidden on admin/HR dashboards
- Settings accessible from all roles
- Consistent design across all dashboards

---

## 🎨 Design Consistency

All dashboards maintain:
- **Color Scheme**: Teal blue (#08796B) and pale mint (#B2DFB8)
- **Typography**: Roboto font family
- **Theme Support**: Full dark mode functionality
- **Layout**: Clean, card-based design with rounded corners
- **Branding**: Oracle logo displayed prominently

---

## 📞 Support

For any issues with login or role assignment:
1. Verify email format includes correct domain (@admin or @hr)
2. Check that email is lowercase (system converts automatically)
3. Ensure proper role assignment in user management
4. Contact system administrator for account issues

---

## 🔄 Future Enhancements

Potential improvements to the login flow:
- [ ] Two-factor authentication
- [ ] Password strength requirements
- [ ] Account recovery flow
- [ ] Role change notifications
- [ ] Session timeout warnings
- [ ] Login attempt tracking
- [ ] IP-based access controls

---

**Last Updated**: October 29, 2025  
**System Version**: 1.0.0  
**Author**: Smart Hostel Development Team

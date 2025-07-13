# User Account System Documentation

## Overview
The BoiToi user account system provides comprehensive profile management functionality for authenticated users. When a user is logged in, they can access their account settings through a dropdown menu in the navigation bar instead of seeing the login/signup button.

## Components Created

### 1. UserProfilePage.jsx (`/src/pages/UserProfilePage.jsx`)
**Purpose**: Main user profile management page
**Route**: `/profile`
**Features**:
- View and edit profile information (username, email, first name, last name, phone, gender, birthday)
- Change password functionality with validation
- Secure logout option
- Responsive design for mobile and desktop
- Form validation and error handling
- Loading states for better UX

**Key Sections**:
- **Profile Information**: Editable user details with save/cancel functionality
- **Security**: Password change section with current/new password validation
- **Account Actions**: Logout button prominently displayed

### 2. userApi.jsx (`/src/services/userApi.jsx`)
**Purpose**: API service layer for user-related operations
**Functions**:
- `getUserProfile(userId)` - Fetch user profile data
- `updateUserProfile(userId, profileData)` - Update user profile
- `changeUserPassword(userId, passwordData)` - Change user password
- `deactivateAccount(userId)` - Deactivate user account (optional)
- `getUserOrderHistory(userId)` - Get user order history (optional)

### 3. UserAccountCard.jsx (`/src/components/UserAccountCard.jsx`)
**Purpose**: Reusable user account card component
**Usage**: Can be used in dashboards, sidebars, or other UI sections
**Features**:
- Display user information
- Quick access to account settings
- Logout functionality

### 4. Updated NavBar.jsx
**Changes Made**:
- Added user account dropdown menu for logged-in users
- Shows username and user icon when authenticated
- Dropdown includes "Account Settings" and "Logout" options
- Mobile-responsive user menu
- Replaced static auth link with conditional rendering

### 5. Updated App.jsx
**Changes Made**:
- Added `/profile` route for UserProfilePage
- Imported UserProfilePage component

### 6. Updated AuthPage.jsx
**Changes Made**:
- Added redirect logic for already logged-in users
- Users are automatically redirected to `/profile` if they access `/auth` while logged in

## User Flow

### For Logged-in Users:
1. **Navigation**: User sees their username and user icon in the navigation bar
2. **Account Access**: Clicking the user icon/username opens a dropdown menu with:
   - "Account Settings" → navigates to `/profile`
   - "Logout" → logs out and redirects to homepage
3. **Profile Management**: On `/profile` page, users can:
   - View all their profile information
   - Edit profile details (save/cancel options)
   - Change their password securely
   - Logout from their account

### For Non-logged-in Users:
1. **Navigation**: User sees a user icon that links to `/auth`
2. **Authentication**: Access to login/signup functionality
3. **Redirect**: After successful login, users are redirected appropriately

## Database Integration

The frontend expects the following API endpoints from the backend:

### User Profile Endpoints:
- `GET /api/user/:id` - Get user profile data
- `PUT /api/user/:id` - Update user profile
- `PUT /api/user/change-password` - Change user password

### Expected User Data Structure:
```javascript
{
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  phone: string,
  gender: string, // 'male', 'female', 'other', 'prefer_not_to_say'
  birthday: string, // ISO date format
  created_at: string,
  last_active: string,
  is_active: boolean
}
```

## Security Features

1. **Authentication Check**: All profile operations require valid user session
2. **Password Validation**: 
   - Current password verification before allowing changes
   - Minimum 6 characters for new passwords
   - Password confirmation matching
3. **Auto-redirect**: Logged-in users are redirected away from auth pages
4. **Session Management**: Proper cleanup on logout

## Styling and UX

- **Consistent Design**: Matches the existing BoiToi design system
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Loading States**: Visual feedback during API operations
- **Toast Notifications**: Success/error messages for user actions
- **Form Validation**: Real-time validation with helpful error messages
- **Accessibility**: Proper labels, focus management, and keyboard navigation

## Usage Examples

### Integrating AddToCartButton with User Authentication:
The existing `AddToCartButton` component already checks for user authentication and shows appropriate messages.

### Adding User Account Features to Other Pages:
```jsx
import { useCart } from '../contexts/CartContext';

const SomePage = () => {
  const { getCurrentUser } = useCart();
  const user = getCurrentUser();
  
  if (user?.id) {
    // Show user-specific content
    return <UserSpecificContent />;
  } else {
    // Show guest content
    return <GuestContent />;
  }
};
```

## Future Enhancements

Potential additions that can be implemented:
1. **Order History**: Display user's past orders
2. **Wishlist**: Save favorite books
3. **Address Management**: Multiple shipping addresses
4. **Account Preferences**: Email notifications, language settings
5. **Account Deactivation**: Allow users to deactivate their accounts
6. **Profile Picture**: If image storage is added later
7. **Two-Factor Authentication**: Enhanced security option

## Testing

To test the user account system:
1. **Login Flow**: Log in with valid credentials
2. **Profile Access**: Click user icon → "Account Settings"
3. **Profile Editing**: Edit profile information and save
4. **Password Change**: Change password with proper validation
5. **Mobile Testing**: Test on mobile devices for responsive behavior
6. **Logout**: Verify proper session cleanup and redirects

The user account system provides a complete, secure, and user-friendly profile management experience that integrates seamlessly with the existing BoiToi application architecture.

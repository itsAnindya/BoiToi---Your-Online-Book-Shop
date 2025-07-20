import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaSignOutAlt, 
  FaEye, 
  FaEyeSlash,
  FaUserCircle,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaUserTag,
  FaShieldAlt
} from 'react-icons/fa';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';
import { getUserProfile, updateUserProfile, changeUserPassword } from '../services/userApi';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { getCurrentUser, clearCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const user = getCurrentUser();

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    birthday: '',
  });

  // Editing form state (separate from display data)
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    birthday: '',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize profile data
  useEffect(() => {
    if (!user?.id) {
      navigate('/auth');
      return;
    }

    // Load user profile data from backend
    const loadUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const result = await getUserProfile(user.id);
        
        if (result.success) {
          // Birthday now comes as clean YYYY-MM-DD string from backend
          const userData = {
            username: result.user.username || '',
            email: result.user.email || '',
            firstName: result.user.firstName || '',
            lastName: result.user.lastName || '',
            phone: result.user.phone || '',
            gender: result.user.gender || '',
            birthday: result.user.birthday || '', // Clean date string from backend
          };
          
          setProfileData(userData);
          setEditFormData(userData); // Initialize edit form with current data
        } else {
          toast.error(result.error || 'Failed to load profile data');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user?.id, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      // Ensure birthday is sent as a pure date string to avoid timezone issues
      let birthdayToSend = editFormData.birthday;
      if (birthdayToSend) {
        // If it's already in YYYY-MM-DD format, use it as-is
        if (typeof birthdayToSend === 'string' && birthdayToSend.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Already in correct format
        } else {
          // Convert to YYYY-MM-DD format if needed
          const date = new Date(birthdayToSend);
          if (!isNaN(date.getTime())) {
            birthdayToSend = date.toISOString().split('T')[0];
          }
        }
      }

      const result = await updateUserProfile(user.id, {
        username: editFormData.username,
        email: editFormData.email,
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        phone: editFormData.phone,
        gender: editFormData.gender,
        birthday: birthdayToSend,
      });

      if (result.success) {
        // Update session storage with new username if changed
        if (editFormData.username !== user.username) {
          sessionStorage.setItem('username', editFormData.username);
        }
        
        // Update the main profile data with the saved data
        setProfileData({...editFormData, birthday: birthdayToSend});
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changeUserPassword(user.id, passwordData);

      if (result.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordSection(false);
      } else {
        toast.error(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    // Clear all session storage items
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    
    // Clear cart data when logging out
    clearCart(); 
    
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cancelEdit = () => {
    // Reset edit form data to the current saved profile data
    setEditFormData(profileData);
    setIsEditing(false);
  };

  const startEdit = () => {
    // Initialize edit form with current profile data
    setEditFormData(profileData);
    setIsEditing(true);
  };

  if (isLoadingProfile && !profileData.username) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border border-slate-200">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm border border-white border-opacity-30">
                      <FaUserCircle className="text-4xl text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-400 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2 text-white">
                      {profileData.firstName && profileData.lastName 
                        ? `${profileData.firstName} ${profileData.lastName}`
                        : profileData.username || 'User Profile'
                      }
                    </h1>
                    <p className="text-slate-300 text-lg">@{profileData.username}</p>
                    <div className="flex items-center justify-center md:justify-start space-x-4 mt-3">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm backdrop-blur-sm text-white">
                        <FaEnvelope className="inline mr-2" />
                        {profileData.email}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  size="lg"
                  className="mt-4 md:mt-0"
                >
                  <FaSignOutAlt />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-slate-700 to-blue-800 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-2xl text-white" />
                      <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    </div>
                    {isEditing ? (
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          variant="success"
                        >
                          <FaSave />
                          {isSavingProfile ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="neutral"
                        >
                          <FaTimes />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={startEdit}
                        variant="outline"
                      >
                        <FaEdit />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Username */}
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <FaUserTag className="text-primary-600" />
                        <span>Username</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={isEditing ? editFormData.username : profileData.username}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-slate-50 hover:bg-white text-slate-900"
                          required
                        />
                      ) : (
                        <div className="bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent group-hover:border-slate-300 transition-all duration-300">
                          <p className="text-slate-900 font-medium">{profileData.username || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <FaEnvelope className="text-emerald-600" />
                        <span>Email</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={isEditing ? editFormData.email : profileData.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-slate-50 hover:bg-white text-slate-900"
                          required
                        />
                      ) : (
                        <div className="bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent group-hover:border-slate-300 transition-all duration-300">
                          <p className="text-slate-900 font-medium">{profileData.email || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* First Name */}
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <FaUser className="text-violet-600" />
                        <span>First Name</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={isEditing ? editFormData.firstName : profileData.firstName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-slate-50 hover:bg-white text-slate-900"
                        />
                      ) : (
                        <div className="bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent group-hover:border-slate-300 transition-all duration-300">
                          <p className="text-slate-900 font-medium">{profileData.firstName || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <FaUser className="text-violet-600" />
                        <span>Last Name</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={isEditing ? editFormData.lastName : profileData.lastName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-slate-50 hover:bg-white text-slate-900"
                        />
                      ) : (
                        <div className="bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent group-hover:border-slate-300 transition-all duration-300">
                          <p className="text-slate-900 font-medium">{profileData.lastName || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <FaPhone className="text-orange-600" />
                        <span>Phone</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={isEditing ? editFormData.phone : profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-slate-50 hover:bg-white text-slate-900"
                        />
                      ) : (
                        <div className="bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent group-hover:border-slate-300 transition-all duration-300">
                          <p className="text-slate-900 font-medium">{profileData.phone || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <FaVenusMars className="text-pink-600" />
                        <span>Gender</span>
                      </label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={isEditing ? editFormData.gender : profileData.gender}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-slate-50 hover:bg-white text-slate-900"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent group-hover:border-slate-300 transition-all duration-300">
                          <p className="text-slate-900 font-medium capitalize">{profileData.gender?.replace('_', ' ') || 'Not set'}</p>
                        </div>
                      )}
                    </div>

                    {/* Birthday */}
                    <div className="md:col-span-2 group">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <FaBirthdayCake className="text-amber-600" />
                        <span>Birthday</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="birthday"
                          value={isEditing ? editFormData.birthday : profileData.birthday}
                          onChange={handleProfileChange}
                          className="w-full md:w-1/2 px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-slate-50 hover:bg-white text-slate-900"
                        />
                      ) : (
                        <div className="bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent group-hover:border-slate-300 transition-all duration-300 w-full md:w-1/2">
                          <p className="text-slate-900 font-medium">
                            {profileData.birthday ? new Date(profileData.birthday).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Not set'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-2xl text-white" />
                    <h2 className="text-2xl font-bold text-white">Security</h2>
                  </div>
                </div>

                <div className="p-6">
                  <Button
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    <FaLock />
                    Change Password
                  </Button>

                  {showPasswordSection && (
                    <div className="mt-6 bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
                      <div className="space-y-6">
                        {/* Current Password */}
                        <div>
                          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                            <FaLock className="text-red-600" />
                            <span>Current Password</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
                              required
                            />
                            <Button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              variant="ghost"
                              size="xs"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2"
                            >
                              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                            <FaLock className="text-emerald-600" />
                            <span>New Password</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
                              required
                            />
                            <Button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              variant="ghost"
                              size="xs"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2"
                            >
                              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                            <FaLock className="text-primary-600" />
                            <span>Confirm New Password</span>
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
                            required
                          />
                        </div>

                        <div className="flex flex-col space-y-3 pt-4">
                          <Button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            variant="primary"
                            size="lg"
                            className="w-full"
                          >
                            <FaLock className="mr-2" />
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowPasswordSection(false);
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              });
                            }}
                            variant="neutral"
                            size="lg"
                            className="w-full"
                          >
                            <FaTimes className="mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserProfilePage;

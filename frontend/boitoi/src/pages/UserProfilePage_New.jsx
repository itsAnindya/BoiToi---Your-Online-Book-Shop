import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaSignOutAlt,
  FaHome,
  FaBuilding,
  FaMapMarkerAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import DefaultLayout from '../layouts/DefaultLayout';
import Button from '../components/ui/Button';
import ProfileInfoCard from '../components/Profile/ProfileInfoCard';
import SecurityCard from '../components/Profile/SecurityCard';
import AddressManagement from '../components/Profile/AddressManagement';
import { useCart } from '../contexts/CartContext';
import { getUserProfile, updateUserProfile, changeUserPassword, updateUserAddress, deleteUserAddress } from '../services/userApi';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { getCurrentUser, clearCart } = useCart();
  const user = getCurrentUser();

  // State for profile management
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    birthday: '',
  });
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    birthday: '',
  });

  // State for password management
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State for address management
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    type: 'home',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false
  });

  // Initialize profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) {
        navigate('/auth');
        return;
      }

      setIsLoadingProfile(true);
      try {
        const result = await getUserProfile(user.id);
        if (result.success) {
          const userData = result.user;
          const formattedBirthday = userData.birthday 
            ? new Date(userData.birthday).toISOString().split('T')[0] 
            : '';

          const profileInfo = {
            username: userData.username || '',
            email: userData.email || '',
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            phone: userData.phone || '',
            gender: userData.gender || '',
            birthday: formattedBirthday,
          };

          setProfileData(profileInfo);
          setEditFormData(profileInfo);
          setAddresses(userData.addresses || []);
        } else {
          toast.error(result.error || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user?.id, navigate]);

  // Profile management functions
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const profileUpdateData = {
        username: editFormData.username,
        email: editFormData.email,
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        phone: editFormData.phone,
        gender: editFormData.gender,
        birthday: editFormData.birthday,
      };

      const result = await updateUserProfile(user.id, profileUpdateData);

      if (result.success) {
        setProfileData(editFormData);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
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

  const startEdit = () => {
    setEditFormData(profileData);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditFormData(profileData);
    setIsEditing(false);
  };

  // Password management functions
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changeUserPassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

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

  // Address management functions
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const startAddingAddress = () => {
    setAddressFormData({
      type: 'home',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      isDefault: false
    });
    setIsAddingAddress(true);
    setEditingAddressId(null);
  };

  const startEditingAddress = (address) => {
    setAddressFormData({
      type: address.address_type,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zip_code || '',
      isDefault: address.is_default
    });
    setEditingAddressId(address.id);
    setIsAddingAddress(false);
  };

  const cancelAddressEdit = () => {
    setAddressFormData({
      type: 'home',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      isDefault: false
    });
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const saveAddress = async () => {
    // Debug: Log the current form data
    console.log('Address form data:', addressFormData);
    
    // Improved validation with trim() to handle whitespace
    const requiredFields = {
      address: addressFormData.address?.trim(),
      city: addressFormData.city?.trim(),
      state: addressFormData.state?.trim(),
      country: addressFormData.country?.trim()
    };

    console.log('Required fields after trim:', requiredFields);

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required address fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSavingAddress(true);
    try {
      const result = await updateUserAddress(user.id, editingAddressId, {
        address_type: addressFormData.type,
        address: addressFormData.address.trim(),
        city: addressFormData.city.trim(),
        state: addressFormData.state.trim(),
        country: addressFormData.country.trim(),
        zip_code: addressFormData.zipCode?.trim() || null,
        is_default: addressFormData.isDefault
      });

      if (result.success) {
        toast.success(editingAddressId ? 'Address updated successfully!' : 'Address added successfully!');
        
        // Reload addresses from the server
        const profileResult = await getUserProfile(user.id);
        if (profileResult.success) {
          setAddresses(profileResult.user.addresses || []);
        }
        
        cancelAddressEdit();
      } else {
        toast.error(result.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const result = await deleteUserAddress(user.id, addressId);

      if (result.success) {
        toast.success('Address deleted successfully!');
        
        // Reload addresses from the server
        const profileResult = await getUserProfile(user.id);
        if (profileResult.success) {
          setAddresses(profileResult.user.addresses || []);
        }
      } else {
        toast.error(result.error || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'office': return <FaBuilding className="text-blue-600" />;
      case 'home': return <FaHome className="text-emerald-600" />;
      default: return <FaMapMarkerAlt className="text-gray-600" />;
    }
  };

  const handleLogout = () => {
    clearCart();
    localStorage.removeItem('boitoi_user');
    navigate('/auth');
  };

  if (isLoadingProfile && !profileData.username) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border border-slate-200">
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
                  <FaSignOutAlt className="mr-2 text-sm group-hover:scale-110 transition-transform" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <ProfileInfoCard
                profileData={profileData}
                editFormData={editFormData}
                isEditing={isEditing}
                isSavingProfile={isSavingProfile}
                handleProfileChange={handleProfileChange}
                handleSaveProfile={handleSaveProfile}
                cancelEdit={cancelEdit}
                startEdit={startEdit}
              />
            </div>

            {/* Security Card */}
            <div className="lg:col-span-1">
              <SecurityCard
                showPasswordSection={showPasswordSection}
                setShowPasswordSection={setShowPasswordSection}
                passwordData={passwordData}
                handlePasswordChange={handlePasswordChange}
                showCurrentPassword={showCurrentPassword}
                setShowCurrentPassword={setShowCurrentPassword}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
                handleChangePassword={handleChangePassword}
                isChangingPassword={isChangingPassword}
                setPasswordData={setPasswordData}
              />
            </div>
          </div>

          {/* Address Management */}
          <AddressManagement
            addresses={addresses}
            isAddingAddress={isAddingAddress}
            editingAddressId={editingAddressId}
            addressFormData={addressFormData}
            isSavingAddress={isSavingAddress}
            handleAddressChange={handleAddressChange}
            startAddingAddress={startAddingAddress}
            startEditingAddress={startEditingAddress}
            cancelAddressEdit={cancelAddressEdit}
            saveAddress={saveAddress}
            deleteAddress={deleteAddress}
            getAddressTypeIcon={getAddressTypeIcon}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserProfilePage;

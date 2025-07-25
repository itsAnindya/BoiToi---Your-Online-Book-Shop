import React from 'react';
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaUserTag, 
  FaEnvelope, 
  FaPhone, 
  FaVenusMars, 
  FaBirthdayCake 
} from 'react-icons/fa';
import Button from '../ui/Button';

const ProfileInfoCard = ({
  profileData,
  editFormData,
  isEditing,
  isSavingProfile,
  handleProfileChange,
  handleSaveProfile,
  cancelEdit,
  startEdit
}) => {
  return (
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
                <FaSave className="mr-2 text-sm group-hover:scale-110 transition-transform" />
                {isSavingProfile ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={cancelEdit}
                variant="neutral"
              >
                <FaTimes className="mr-2 text-sm group-hover:rotate-90 transition-transform" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={startEdit}
              variant="outline"
            >
              <FaEdit className="mr-2 text-sm group-hover:scale-110 transition-transform" />
              <span>Edit Profile</span>
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
  );
};

export default ProfileInfoCard;

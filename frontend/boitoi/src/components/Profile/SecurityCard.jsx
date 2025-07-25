import React from 'react';
import { FaShieldAlt, FaLock, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../ui/Button';

const SecurityCard = ({
  showPasswordSection,
  setShowPasswordSection,
  passwordData,
  handlePasswordChange,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  handleChangePassword,
  isChangingPassword,
  setPasswordData
}) => {
  return (
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
          <FaLock className="mr-2 text-sm group-hover:scale-110 transition-transform" />
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

              {/* Confirm New Password */}
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
                  <FaLock className="mr-2 text-sm group-hover:scale-110 transition-transform" />
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
                  <FaTimes className="mr-2 text-sm group-hover:rotate-90 transition-transform" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityCard;

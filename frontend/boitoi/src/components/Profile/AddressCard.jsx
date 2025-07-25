import React, { useState } from 'react';
import { FaHome, FaBuilding, FaEdit, FaTrash, FaSave, FaTimes, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../ui/Button';

const AddressCard = ({
  address,
  getAddressTypeIcon,
  startEditingAddress,
  deleteAddress,
  saveAddress,
  handleAddressChange,
  editingAddressId,
  addressFormData,
  isSavingAddress,
  cancelAddressEdit
}) => {
  const isEditing = editingAddressId === address.id || (address.id === null && editingAddressId === null);

  // Debug: Log address data to see the structure
  console.log('Address data:', address);

  const getAddressTypeLabel = (type) => {
    return type === 'home' ? 'Home Address' : 'Office Address';
  };

  const getAddressIcon = (type) => {
    return type === 'home' ? 
      <FaHome className="text-emerald-600" /> : 
      <FaBuilding className="text-blue-600" />;
  };

  // Check if this address is default (handle both field names and different value types)
  const isDefaultAddress = address.is_default === 1 || address.isDefault === 1;

  if (isEditing) {
    // Edit mode - inline editing
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <FaEdit className="mr-2 text-blue-600" />
          Edit Address
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Address Type</label>
            <select
              name="type"
              value={addressFormData.type}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="home">Home Address</option>
              <option value="office">Office Address</option>
            </select>
          </div>

          {/* Default Address */}
          <div className="flex items-center">
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isDefault"
                checked={addressFormData.isDefault}
                onChange={handleAddressChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <FaStar className="text-amber-500" />
              <span>Set as Default</span>
            </label>
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
            <input
              type="text"
              name="address"
              value={addressFormData.address}
              onChange={handleAddressChange}
              placeholder="Enter street address"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={addressFormData.city}
              onChange={handleAddressChange}
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">State/Province</label>
            <input
              type="text"
              name="state"
              value={addressFormData.state}
              onChange={handleAddressChange}
              placeholder="Enter state or province"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={addressFormData.country}
              onChange={handleAddressChange}
              placeholder="Enter country"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ZIP/Postal Code (Optional)</label>
            <input
              type="text"
              name="zipCode"
              value={addressFormData.zipCode}
              onChange={handleAddressChange}
              placeholder="Enter ZIP or postal code (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={saveAddress}
            disabled={isSavingAddress}
            variant="success"
            size="md"
          >
            <FaSave className="mr-2 text-sm group-hover:scale-110 transition-transform" />
            <span>{isSavingAddress ? 'Saving...' : 'Save Changes'}</span>
          </Button>
          <Button
            onClick={cancelAddressEdit}
            variant="neutral"
            size="md"
          >
            <FaTimes className="mr-2 text-sm group-hover:rotate-90 transition-transform" />
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {getAddressIcon(address.address_type || address.type)}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 flex items-center">
              {getAddressTypeLabel(address.address_type || address.type)}
              {isDefaultAddress && (
                <span className="ml-3 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  DEFAULT
                </span>
              )}
            </h4>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => startEditingAddress(address)}
            variant="outline"
            size="sm"
          >
            <FaEdit className="mr-1 text-sm group-hover:scale-110 transition-transform" />
            <span>Edit</span>
          </Button>
          <Button
            onClick={() => deleteAddress(address.id)}
            variant="danger"
            size="sm"
          >
            <FaTrash className="mr-1 text-sm group-hover:scale-110 transition-transform" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Address Details - Left Aligned with proper formatting */}
      <div className="text-left space-y-3">
        {/* Street Address */}
        <div className="flex items-start space-x-3">
          <FaMapMarkerAlt className="text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Street Address</p>
            <p className="text-slate-800 font-medium">{address.address}</p>
          </div>
        </div>

        {/* City & State */}
        <div className="flex items-start space-x-3">
          <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">City & State</p>
            <p className="text-slate-800 font-medium">{address.city}, {address.state}</p>
          </div>
        </div>

        {/* Country */}
        <div className="flex items-start space-x-3">
          <FaMapMarkerAlt className="text-purple-600 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Country</p>
            <p className="text-slate-800 font-medium">{address.country}</p>
          </div>
        </div>

        {/* ZIP Code (only if exists) */}
        {(address.zip_code || address.zipCode) && (
          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">ZIP/Postal Code</p>
              <p className="text-slate-800 font-medium">{address.zip_code || address.zipCode}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressCard;

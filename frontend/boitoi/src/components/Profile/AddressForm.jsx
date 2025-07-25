import React from 'react';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaHome, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaStar 
} from 'react-icons/fa';
import Button from '../ui/Button';

const AddressForm = ({
  editingAddressId,
  addressFormData,
  handleAddressChange,
  saveAddress,
  isSavingAddress,
  cancelAddressEdit
}) => {
  return (
    <div className="mb-8 bg-gradient-to-br from-slate-50 to-emerald-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
        <FaEdit className="mr-2 text-emerald-600" />
        {editingAddressId ? 'Edit Address' : 'Add New Address'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Type */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
            <FaHome className="text-emerald-600" />
            <span>Address Type</span>
          </label>
          <select
            name="type"
            value={addressFormData.type}
            onChange={handleAddressChange}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
          >
            <option value="home">Home Address</option>
            <option value="office">Office Address</option>
          </select>
        </div>

        {/* Default Address */}
        <div className="flex items-center">
          <label className="flex items-center space-x-3 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={addressFormData.isDefault}
              onChange={handleAddressChange}
              className="w-5 h-5 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <FaStar className="text-amber-500" />
            <span>Set as Default Address</span>
          </label>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
            <FaMapMarkerAlt className="text-emerald-600" />
            <span>Street Address</span>
          </label>
          <input
            type="text"
            name="address"
            value={addressFormData.address}
            onChange={handleAddressChange}
            placeholder="Enter street address"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
            <FaBuilding className="text-emerald-600" />
            <span>City</span>
          </label>
          <input
            type="text"
            name="city"
            value={addressFormData.city}
            onChange={handleAddressChange}
            placeholder="Enter city"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
            required
          />
        </div>

        {/* State */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
            <FaMapMarkerAlt className="text-emerald-600" />
            <span>State/Province</span>
          </label>
          <input
            type="text"
            name="state"
            value={addressFormData.state}
            onChange={handleAddressChange}
            placeholder="Enter state or province"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
            <FaMapMarkerAlt className="text-emerald-600" />
            <span>Country</span>
          </label>
          <input
            type="text"
            name="country"
            value={addressFormData.country}
            onChange={handleAddressChange}
            placeholder="Enter country"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
            required
          />
        </div>

        {/* ZIP Code */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
            <FaMapMarkerAlt className="text-emerald-600" />
            <span>ZIP/Postal Code (Optional)</span>
          </label>
          <input
            type="text"
            name="zipCode"
            value={addressFormData.zipCode}
            onChange={handleAddressChange}
            placeholder="Enter ZIP or postal code (optional)"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
        <Button
          onClick={saveAddress}
          disabled={isSavingAddress}
          variant="success"
          size="lg"
        >
          <FaSave className="mr-2 text-sm group-hover:scale-110 transition-transform" />
          <span>{isSavingAddress ? 'Saving...' : (editingAddressId ? 'Update Address' : 'Add Address')}</span>
        </Button>
        <Button
          onClick={cancelAddressEdit}
          variant="neutral"
          size="lg"
        >
          <FaTimes className="mr-2 text-sm group-hover:rotate-90 transition-transform" />
          <span>Cancel</span>
        </Button>
      </div>
    </div>
  );
};

export default AddressForm;

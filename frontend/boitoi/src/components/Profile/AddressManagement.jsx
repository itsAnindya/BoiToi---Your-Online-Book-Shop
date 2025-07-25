import React from 'react';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import Button from '../ui/Button';
import AddressForm from './AddressForm';
import AddressCard from './AddressCard';

const AddressManagement = ({
  addresses,
  isAddingAddress,
  editingAddressId,
  addressFormData,
  isSavingAddress,
  handleAddressChange,
  startAddingAddress,
  startEditingAddress,
  cancelAddressEdit,
  saveAddress,
  deleteAddress,
  getAddressTypeIcon
}) => {
  return (
    <div className="mt-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-2xl text-white" />
              <h2 className="text-2xl font-bold text-white">Address Management</h2>
            </div>
            <Button
              onClick={startAddingAddress}
              variant="primary"
              size="md"
            >
              <FaPlus className="mr-2 text-sm group-hover:scale-110 transition-transform" />
              <span>Add Address</span>
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Address List */}
          <div className="space-y-4">
            {/* Show add form as an inline card when adding */}
            {isAddingAddress && !editingAddressId && (
              <AddressCard
                key="new-address"
                address={{
                  id: null,
                  address_type: addressFormData.type,
                  address: addressFormData.address,
                  city: addressFormData.city,
                  state: addressFormData.state,
                  country: addressFormData.country,
                  zip_code: addressFormData.zipCode,
                  is_default: addressFormData.isDefault ? 1 : 0
                }}
                getAddressTypeIcon={getAddressTypeIcon}
                startEditingAddress={startEditingAddress}
                deleteAddress={deleteAddress}
                saveAddress={saveAddress}
                handleAddressChange={handleAddressChange}
                editingAddressId={null} // This will force edit mode since address.id is null
                addressFormData={addressFormData}
                isSavingAddress={isSavingAddress}
                cancelAddressEdit={cancelAddressEdit}
              />
            )}

            {addresses.length === 0 && !isAddingAddress ? (
              <div className="text-center py-12">
                <FaMapMarkerAlt className="text-4xl text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No addresses saved yet</p>
                <p className="text-slate-500">Add your first address to get started</p>
              </div>
            ) : (
              addresses.map((address, index) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  index={index}
                  getAddressTypeIcon={getAddressTypeIcon}
                  startEditingAddress={startEditingAddress}
                  deleteAddress={deleteAddress}
                  saveAddress={saveAddress}
                  handleAddressChange={handleAddressChange}
                  editingAddressId={editingAddressId}
                  addressFormData={addressFormData}
                  isSavingAddress={isSavingAddress}
                  cancelAddressEdit={cancelAddressEdit}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressManagement;

const bcrypt = require('bcrypt');
const db = require('../config/database');

/**
 * Get User Profile Controller
 * Retrieves user profile information including basic details and addresses
 */
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('getUserProfile called for userId:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Query user information
    const userSql = `
      SELECT 
        ID, USERNAME, EMAIL, FIRST_NAME, LAST_NAME, 
        PHONE, CREATED_AT, GENDER, BIRTHDAY, IS_ACTIVE
      FROM USER 
      WHERE ID = ?
    `;

      db.query(userSql, [userId], (err, userResults) => {
        if (err) {
          console.error('Database error fetching user profile:', err);
          return res.status(500).json({ message: 'Server error fetching user profile' });
        }

        console.log('User query results:', userResults);

        if (userResults.length === 0) {
          console.log('No user found with ID:', userId);
          return res.status(404).json({ message: 'User not found' });
        }

        const user = userResults[0];
        console.log('User found:', user);
        console.log('Original birthday:', user.BIRTHDAY, typeof user.BIRTHDAY);      // Query user addresses
      const addressSql = `
        SELECT 
          ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT
        FROM USER_ADDRESS 
        WHERE USER_ID = ?
        ORDER BY IS_DEFAULT DESC, ID ASC
      `;

      db.query(addressSql, [userId], (err, addressResults) => {
        if (err) {
          console.error('Database error fetching user addresses:', err);
          return res.status(500).json({ message: 'Server error fetching user addresses' });
        }

        // Format the response
        const userProfile = {
          id: user.ID,
          username: user.USERNAME,
          email: user.EMAIL,
          firstName: user.FIRST_NAME,
          lastName: user.LAST_NAME,
          phone: user.PHONE,
          gender: user.GENDER,
          birthday: user.BIRTHDAY ? user.BIRTHDAY.toISOString().split('T')[0] : null, // Format as YYYY-MM-DD string
          createdAt: user.CREATED_AT,
          isActive: user.IS_ACTIVE,
          addresses: addressResults.map(addr => ({
            id: addr.ID,
            type: addr.ADDRESS_TYPE,
            address: addr.ADDRESS,
            city: addr.CITY,
            state: addr.STATE,
            country: addr.COUNTRY,
            zipCode: addr.ZIP_CODE,
            isDefault: addr.IS_DEFAULT
          }))
        };

        console.log('Formatted user profile birthday:', userProfile.birthday);
        console.log('Sending response:', userProfile);

        res.json({
          message: 'User profile retrieved successfully',
          user: userProfile
        });
      });
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update User Profile Controller
 * Updates user basic information (not including addresses)
 */
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      username,
      email,
      first_name,
      last_name,
      firstName,
      lastName,
      phone,
      gender,
      birthday
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Support both naming conventions
    const finalFirstName = firstName || first_name;
    const finalLastName = lastName || last_name;

    console.log('Update request data:', {
      username,
      email,
      first_name,
      last_name,
      firstName,
      lastName,
      finalFirstName,
      finalLastName,
      phone,
      gender,
      birthday
    });

    // Check if user exists
    const checkUserSql = 'SELECT ID FROM USER WHERE ID = ?';
    
    db.query(checkUserSql, [userId], (err, results) => {
      if (err) {
        console.error('Database error checking user:', err);
        return res.status(500).json({ message: 'Server error checking user' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Validate email uniqueness if email is being updated
      if (email !== undefined) {
        const checkEmailSql = 'SELECT ID FROM USER WHERE EMAIL = ? AND ID != ?';
        
        db.query(checkEmailSql, [email, userId], (err, emailResults) => {
          if (err) {
            console.error('Database error checking email uniqueness:', err);
            return res.status(500).json({ message: 'Server error checking email' });
          }

          if (emailResults.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
          }

          // Continue with username check
          validateUsernameAndUpdate();
        });
      } else {
        // Skip email validation
        validateUsernameAndUpdate();
      }

      function validateUsernameAndUpdate() {
        // Validate username uniqueness if username is being updated
        if (username !== undefined) {
          const checkUsernameSql = 'SELECT ID FROM USER WHERE USERNAME = ? AND ID != ?';
          
          db.query(checkUsernameSql, [username, userId], (err, usernameResults) => {
            if (err) {
              console.error('Database error checking username uniqueness:', err);
              return res.status(500).json({ message: 'Server error checking username' });
            }

            if (usernameResults.length > 0) {
              return res.status(400).json({ message: 'Username already exists' });
            }

            // Continue with update
            performUpdate();
          });
        } else {
          // Skip username validation
          performUpdate();
        }
      }

      function performUpdate() {
        // Prepare update SQL and values
        const updateFields = [];
        const updateValues = [];

        if (username !== undefined) {
          updateFields.push('USERNAME = ?');
          updateValues.push(username);
        }
        if (email !== undefined) {
          updateFields.push('EMAIL = ?');
          updateValues.push(email);
        }
        if (finalFirstName !== undefined) {
          updateFields.push('FIRST_NAME = ?');
          updateValues.push(finalFirstName);
        }
        if (finalLastName !== undefined) {
          updateFields.push('LAST_NAME = ?');
          updateValues.push(finalLastName);
        }
        if (phone !== undefined) {
          updateFields.push('PHONE = ?');
          updateValues.push(phone);
        }
        if (gender !== undefined) {
          updateFields.push('GENDER = ?');
          updateValues.push(gender);
        }
        if (birthday !== undefined) {
          // Store birthday as-is without timezone manipulation to avoid offset issues
          // Ensure we handle the birthday as a pure date string without timezone conversion
          let birthdayDate = null;
          if (birthday) {
            console.log('Received birthday:', birthday, typeof birthday);
            // If birthday is a date string like "1990-05-15", validate it and use directly
            // This prevents timezone conversion issues that can shift the date by one day
            if (typeof birthday === 'string' && birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
              birthdayDate = birthday; // Use the date string directly
              console.log('Using birthday string directly:', birthdayDate);
            } else {
              // If it's not in the expected format, try to parse and format it correctly
              const date = new Date(birthday);
              if (!isNaN(date.getTime())) {
                // Format as YYYY-MM-DD to avoid timezone issues
                birthdayDate = date.toISOString().split('T')[0];
                console.log('Formatted birthday from date:', birthdayDate);
              }
            }
          }
          updateFields.push('BIRTHDAY = ?');
          updateValues.push(birthdayDate);
          console.log('Final birthday value to store:', birthdayDate);
        }

        if (updateFields.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
        }

        // Add user ID for WHERE clause
        updateValues.push(userId);

        const updateSql = `UPDATE USER SET ${updateFields.join(', ')} WHERE ID = ?`;

        console.log('Update SQL:', updateSql);
        console.log('Update values:', updateValues);

        db.query(updateSql, updateValues, (err) => {
          if (err) {
            console.error('Database error updating user profile:', err);
            return res.status(500).json({ message: 'Server error updating user profile' });
          }

          res.json({ 
            success: true,
            message: 'User profile updated successfully' 
          });
        });
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Change Password Controller
 * Updates user password with verification
 */
const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'User ID, current password, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get current password hash
    const getUserSql = 'SELECT PASSWORD_HASH FROM USER WHERE ID = ?';
    
    db.query(getUserSql, [userId], async (err, results) => {
      if (err) {
        console.error('Database error fetching user for password change:', err);
        return res.status(500).json({ message: 'Server error fetching user' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results[0];

      // Verify current password
      const match = await bcrypt.compare(currentPassword, user.PASSWORD_HASH);
      if (!match) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      const updatePasswordSql = 'UPDATE USER SET PASSWORD_HASH = ? WHERE ID = ?';
      
      db.query(updatePasswordSql, [hashedNewPassword, userId], (err) => {
        if (err) {
          console.error('Database error updating password:', err);
          return res.status(500).json({ message: 'Server error updating password' });
        }

        res.json({ message: 'Password changed successfully' });
      });
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update User Address Controller
 * Updates an existing address or creates a new one
 */
const updateUserAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const {
      addressType,
      address,
      city,
      state,
      country,
      zipCode,
      isDefault
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const checkUserSql = 'SELECT ID FROM USER WHERE ID = ?';
    
    db.query(checkUserSql, [userId], (err, userResults) => {
      if (err) {
        console.error('Database error checking user:', err);
        return res.status(500).json({ message: 'Server error checking user' });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if this is a create (POST) or update (PUT) operation
      const isCreate = req.method === 'POST' || !addressId;

      if (!isCreate && addressId) {
        // Update existing address
        const updateFields = [];
        const updateValues = [];

        if (addressType !== undefined) {
          updateFields.push('ADDRESS_TYPE = ?');
          updateValues.push(addressType);
        }
        if (address !== undefined) {
          updateFields.push('ADDRESS = ?');
          updateValues.push(address);
        }
        if (city !== undefined) {
          updateFields.push('CITY = ?');
          updateValues.push(city);
        }
        if (state !== undefined) {
          updateFields.push('STATE = ?');
          updateValues.push(state);
        }
        if (country !== undefined) {
          updateFields.push('COUNTRY = ?');
          updateValues.push(country);
        }
        if (zipCode !== undefined) {
          updateFields.push('ZIP_CODE = ?');
          updateValues.push(zipCode);
        }
        if (isDefault !== undefined) {
          updateFields.push('IS_DEFAULT = ?');
          updateValues.push(isDefault);
        }

        if (updateFields.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
        }

        // Add addressId and userId for WHERE clause
        updateValues.push(addressId, userId);

        const updateSql = `UPDATE USER_ADDRESS SET ${updateFields.join(', ')} WHERE ID = ? AND USER_ID = ?`;

        db.query(updateSql, updateValues, (err, result) => {
          if (err) {
            console.error('Database error updating address:', err);
            return res.status(500).json({ message: 'Server error updating address' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Address not found or does not belong to user' });
          }

          res.json({ message: 'Address updated successfully' });
        });
      } else {
        // Create new address
        if (!addressType || !address || !city || !state || !country || !zipCode) {
          return res.status(400).json({ message: 'All address fields are required for new address' });
        }

        // Get new address ID
        const countAddressSql = 'SELECT COUNT(*) AS count FROM USER_ADDRESS';
        
        db.query(countAddressSql, (err, countResult) => {
          if (err) {
            console.error('Error counting user addresses:', err);
            return res.status(500).json({ message: 'Server error counting addresses' });
          }

          const newAddressId = countResult[0].count + 1;

          const insertAddressSql = `
            INSERT INTO USER_ADDRESS (
              ID, USER_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const addressValues = [
            newAddressId,
            userId,
            addressType,
            address,
            city,
            state,
            country,
            zipCode,
            isDefault || 0
          ];

          db.query(insertAddressSql, addressValues, (err) => {
            if (err) {
              console.error('Error inserting new address:', err);
              return res.status(500).json({ message: 'Server error creating new address' });
            }

            res.status(201).json({ 
              message: 'New address created successfully',
              addressId: newAddressId
            });
          });
        });
      }
    });
  } catch (error) {
    console.error('Update user address error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete User Address Controller
 * Deletes a user address (cannot delete if it's the only address)
 */
const deleteUserAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({ message: 'User ID and Address ID are required' });
    }

    // Check if user has more than one address
    const countAddressesSql = 'SELECT COUNT(*) AS count FROM USER_ADDRESS WHERE USER_ID = ?';
    
    db.query(countAddressesSql, [userId], (err, countResult) => {
      if (err) {
        console.error('Database error counting user addresses:', err);
        return res.status(500).json({ message: 'Server error counting addresses' });
      }

      if (countResult[0].count <= 1) {
        return res.status(400).json({ message: 'Cannot delete the only address. Users must have at least one address.' });
      }

      // Delete the address
      const deleteAddressSql = 'DELETE FROM USER_ADDRESS WHERE ID = ? AND USER_ID = ?';
      
      db.query(deleteAddressSql, [addressId, userId], (err, result) => {
        if (err) {
          console.error('Database error deleting address:', err);
          return res.status(500).json({ message: 'Server error deleting address' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Address not found or does not belong to user' });
        }

        res.json({ message: 'Address deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Delete user address error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateUserAddress,
  deleteUserAddress
};

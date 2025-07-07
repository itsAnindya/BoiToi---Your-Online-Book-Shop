const bcrypt = require('bcrypt');
const db = require('../config/database');

/**
 * Login Controller
 * Handles user authentication
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('Login attempt:', { username });

    // Query user by username
    const sql = 'SELECT * FROM USER WHERE USERNAME = ?';
    
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('Database error during login:', err);
        return res.status(500).json({ message: 'Server error during login' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'No such user' });
      }

      const user = results[0];
      
      // Verify password
      const match = await bcrypt.compare(password, user.PASSWORD_HASH);
      if (!match) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const userId = user.ID;

      // Update user active status
      const updateSql = 'UPDATE USER SET IS_ACTIVE = 1, LAST_ACTIVE = NOW() WHERE ID = ?';
      
      db.query(updateSql, [userId], (err) => {
        if (err) {
          console.error('Error updating user active status:', err);
          return res.status(500).json({ message: 'Server error updating active state' });
        }

        // Check if user is admin
        const adminSql = 'SELECT * FROM ADMIN WHERE USER_ID = ?';
        
        db.query(adminSql, [userId], (err, adminResults) => {
          if (err) {
            console.error('Error checking admin status:', err);
            return res.status(500).json({ message: 'Server error checking admin status' });
          }

          const role = adminResults.length > 0 ? 'admin' : 'user';
          console.log(`User ${userId} logged in as ${role}`);
          
          return res.json({ 
            message: 'Login successful', 
            role, 
            id: userId,
            username: user.USERNAME
          });
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Signup Controller
 * Handles user registration
 */
const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      gender,
      birthday,
      address: addressObj
    } = req.body;

    const {
      type: address_type,
      address,
      city,
      state,
      country,
      zipCode
    } = addressObj || {};

    // Validate required fields
    if (!username || !email || !password || !address_type || !address || !city || !state || !country || !zipCode) {
      console.log('Missing required fields:', {
        username: !!username,
        email: !!email,
        password: !!password,
        address_type: !!address_type,
        address: !!address,
        city: !!city,
        state: !!state,
        country: !!country,
        zipCode: !!zipCode
      });
      return res.status(400).json({ message: 'Missing required user or address fields' });
    }

    // Check if username or email already exists
    const checkSql = 'SELECT * FROM USER WHERE USERNAME = ? OR EMAIL = ?';
    
    db.query(checkSql, [username, email], async (err, results) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ message: 'Server error checking existing user' });
      }
      
      if (results.length > 0) {
        console.log('Username or email already exists:', { username, email });
        return res.status(409).json({ message: 'Username or email already exists' });
      }

      // Get new user ID
      const countUserSql = 'SELECT COUNT(*) AS count FROM USER';
      
      db.query(countUserSql, async (err, countResult) => {
        if (err) {
          console.error('Error counting users:', err);
          return res.status(500).json({ message: 'Server error counting users' });
        }

        const id = countResult[0].count + 1;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const insertUserSql = `
          INSERT INTO USER (
            ID, USERNAME, EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, PHONE,
            CREATED_AT, LAST_ACTIVE, IS_ACTIVE, GENDER, BIRTHDAY
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)
        `;

        const userValues = [
          id,
          username,
          email,
          hashedPassword,
          first_name || null,
          last_name || null,
          phone || null,
          0, // is_active initial value
          gender || 'UNSPECIFIED',
          birthday || null
        ];

        db.query(insertUserSql, userValues, (err) => {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Server error inserting user' });
          }
          
          // Get new address ID
          const countAddressSql = 'SELECT COUNT(*) AS count FROM USER_ADDRESS';
          
          db.query(countAddressSql, (err, addressCountResult) => {
            if (err) {
              console.error('Error counting user addresses:', err);
              return res.status(500).json({ message: 'Server error counting addresses' });
            }

            const userAddressId = addressCountResult[0].count + 1;

            // Insert address
            const insertAddressSql = `
              INSERT INTO USER_ADDRESS (
                ID, USER_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const addressValues = [
              userAddressId,
              id,
              address_type,
              address,
              city,
              state,
              country,
              zipCode,
              1 // IS_DEFAULT always 1
            ];

            db.query(insertAddressSql, addressValues, (err) => {
              if (err) {
                console.error('Error inserting address:', err);
                return res.status(500).json({ message: 'Server error inserting address' });
              }
              
              console.log(`User ${username} successfully registered with ID: ${id}`);
              res.status(201).json({ 
                message: 'Signup successful',
                userId: id,
                username: username
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  signup
};
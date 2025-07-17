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

/**
 * Publisher Login Controller
 * Handles publisher authentication
 */
const publisherLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('Publisher login attempt:', { username });

    // Query publisher by name (not email)
    const sql = 'SELECT * FROM PUBLISHER WHERE NAME = ? AND STATUS = "ACTIVE"';
    
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('Database error during publisher login:', err);
        return res.status(500).json({ message: 'Server error during login' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'No such publisher or account inactive' });
      }

      const publisher = results[0];
      
      // Verify password
      const match = await bcrypt.compare(password, publisher.PASSWORD_HASH);
      if (!match) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      console.log(`Publisher ${publisher.ID} logged in successfully`);
      
      return res.json({ 
        message: 'Login successful', 
        role: 'publisher',
        id: publisher.ID,
        name: publisher.NAME,
        email: publisher.EMAIL,
        username: publisher.NAME // Return name as username for consistency
      });
    });
  } catch (error) {
    console.error('Publisher login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Publisher Signup Controller
 * Handles publisher registration
 */
const publisherSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      city,
      state,
      country,
      website
    } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if publisher already exists
    const checkSql = 'SELECT * FROM PUBLISHER WHERE EMAIL = ?';
    
    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error('Database error checking publisher:', err);
        return res.status(500).json({ message: 'Server error checking publisher' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Publisher with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Get next publisher ID
      const maxIdSql = 'SELECT MAX(ID) as maxId FROM PUBLISHER';
      
      db.query(maxIdSql, (err, results) => {
        if (err) {
          console.error('Error getting max publisher ID:', err);
          return res.status(500).json({ message: 'Server error getting max ID' });
        }

        const id = (results[0].maxId || 0) + 1;

        // Insert publisher
        const insertSql = `
          INSERT INTO PUBLISHER (ID, NAME, EMAIL, PHONE, PASSWORD_HASH, ADDRESS, CITY, STATE, COUNTRY, WEBSITE, CREATED_AT, STATUS)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'ACTIVE')
        `;
        
        const values = [id, name, email, phone, hashedPassword, address, city, state, country, website];

        db.query(insertSql, values, (err) => {
          if (err) {
            console.error('Error inserting publisher:', err);
            return res.status(500).json({ message: 'Server error inserting publisher' });
          }
          
          console.log(`Publisher ${name} successfully registered with ID: ${id}`);
          res.status(201).json({ 
            message: 'Publisher signup successful',
            publisherId: id,
            name: name
          });
        });
      });
    });
  } catch (error) {
    console.error('Publisher signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  signup,
  publisherLogin,
  publisherSignup
};
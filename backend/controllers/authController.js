// backend/controllers/authController.js
const bcrypt  = require('bcrypt');
const { pool } = require('../config/db');
const config  = require('../config');            // export BCRYPT_SALT_ROUNDS = 10 (for example)

/* ----------------------------------------------------------- *
 *  Helpers
 * ----------------------------------------------------------- */
const getUserByUsername = async (username) => {
  const [rows] = await pool.promise().query(
    'SELECT * FROM USER WHERE USERNAME = ?',
    [username]
  );
  return rows[0];
};

const isAdmin = async (userId) => {
  const [rows] = await pool.promise().query(
    'SELECT 1 FROM ADMIN WHERE USER_ID = ? LIMIT 1',
    [userId]
  );
  return rows.length > 0;
};

/* ----------------------------------------------------------- *
 *  POST /api/auth/login
 * ----------------------------------------------------------- */
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for ${username}`);

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'No such user' });
    }

    const match = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // 1️⃣ update active flags (not inside a transaction—single query is fine)
    await pool.promise().query(
      'UPDATE USER SET IS_ACTIVE = 1, LAST_ACTIVE = NOW() WHERE ID = ?',
      [user.ID]
    );

    // 2️⃣ determine role
    const role = (await isAdmin(user.ID)) ? 'admin' : 'user';
    console.log(`User ${user.ID} logged in as ${role}`);

    res.json({ success: true, data: { id: user.ID, role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ----------------------------------------------------------- *
 *  POST /api/auth/signup
 * ----------------------------------------------------------- */
const signup = async (req, res) => {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    phone,
    gender,
    birthday,
    address: addr = {},
  } = req.body;

  const {
    type: address_type,
    address,
    city,
    state,
    country,
    zipCode,
  } = addr;

  /* basic required‑field check */
  if (
    !username || !email || !password ||
    !address_type || !address || !city || !state || !country || !zipCode
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required user or address fields' });
  }

  try {
    /* 1️⃣ make sure username / email are unique */
    const [dup] = await pool.promise().query(
      'SELECT 1 FROM USER WHERE USERNAME = ? OR EMAIL = ? LIMIT 1',
      [username, email]
    );
    if (dup.length) {
      return res
        .status(409)
        .json({ success: false, message: 'Username or email already exists' });
    }

    /* 2️⃣ hash password */
    const saltRounds = config.BCRYPT_SALT_ROUNDS || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    /* 3️⃣ transaction: insert user + address */
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      /* insert user (ID auto‑generated) */
      const [userResult] = await conn.query(
        `INSERT INTO USER (
          USERNAME, EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, PHONE,
          CREATED_AT, LAST_ACTIVE, IS_ACTIVE, GENDER, BIRTHDAY
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 0, ?, ?)`,
        [
          username,
          email,
          passwordHash,
          first_name || null,
          last_name || null,
          phone      || null,
          gender     || 'UNSPECIFIED',
          birthday   || null,
        ]
      );
      const userId = userResult.insertId;

      /* insert address */
      await conn.query(
        `INSERT INTO USER_ADDRESS (
          USER_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, COUNTRY, ZIP_CODE, IS_DEFAULT
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [userId, address_type, address, city, state, country, zipCode]
      );

      await conn.commit();
      res.status(201).json({ success: true, message: 'Signup successful' });
    } catch (txErr) {
      await conn.rollback();
      console.error('Signup transaction error:', txErr);
      res.status(500).json({ success: false, message: 'Failed to sign up' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login, signup };

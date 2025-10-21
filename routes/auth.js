const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/database');
const { generateToken, verifyToken, isSuperAdmin } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', username, password);
    
    const [users] = await db.execute(
      'SELECT * FROM ci_users WHERE username = ?',
      [username]
    );
    
    console.log('Found users:', users.length);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const user = users[0];
    
    // Check if password is hashed or plain text
    const isValidPassword = user.password.startsWith('$2b$') && user.password.length === 60
      ? await bcrypt.compare(password, user.password)
      : password === user.password;
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    
    if (user.is_active !== 1) {
      return res.status(401).json({ error: 'Account inactive' });
    }
    
    // Update last login
    await db.execute(
      'UPDATE ci_users SET last_login = NOW() WHERE user_id = ?',
      [user.user_id]
    );
    
    const token = generateToken(user);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        admin_role_id: user.admin_role_id,
        is_supper: user.is_supper
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user (super admin only)
router.put('/update/:userId', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, firstname, lastname, email, password, admin_role_id, is_active } = req.body;
    
    let updateFields = [];
    let values = [];
    
    if (username) { updateFields.push('username = ?'); values.push(username); }
    if (firstname) { updateFields.push('firstname = ?'); values.push(firstname); }
    if (lastname) { updateFields.push('lastname = ?'); values.push(lastname); }
    if (email) { updateFields.push('email = ?'); values.push(email); }
    if (admin_role_id) { updateFields.push('admin_role_id = ?'); values.push(admin_role_id); }
    if (is_active !== undefined) { updateFields.push('is_active = ?'); values.push(is_active); }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(userId);
    
    await db.execute(
      `UPDATE ci_users SET ${updateFields.join(', ')} WHERE user_id = ?`,
      values
    );
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT u.*, r.admin_role_title FROM ci_users u LEFT JOIN ci_admin_roles r ON u.admin_role_id = r.admin_role_id WHERE u.user_id = ?',
      [req.user.user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    delete user.password;
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (super admin only)
router.get('/users', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT user_id, username, firstname, lastname, email, admin_role_id, is_active, is_supper FROM ci_users'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
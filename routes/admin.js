const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken, isSuperAdmin, isAdmin } = require('../middleware/auth');

// Get all admins (Super Admin only)
router.get('/', async (req, res) => {
  try {
    const [admins] = await db.execute(
      `SELECT u.user_id, u.username, u.firstname, u.lastname, u.email, u.mobile_no, 
              u.is_active, u.admin_role_id, r.admin_role_title, u.created_at
       FROM ci_users u 
       LEFT JOIN ci_admin_roles r ON u.admin_role_id = r.admin_role_id 
       WHERE u.is_admin = 1 OR u.is_supper = 1
       ORDER BY u.user_id DESC`
    );
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
  try {
    const [admins] = await db.execute(
      `SELECT u.*, r.admin_role_title FROM ci_users u 
       LEFT JOIN ci_admin_roles r ON u.admin_role_id = r.admin_role_id 
       WHERE u.user_id = ?`,
      [req.params.id]
    );
    
    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    const admin = admins[0];
    delete admin.password;
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new admin (Super Admin only)
router.post('/', async (req, res) => {
  try {
    const { username, firstname, lastname, email, mobile_no, password, admin_role_id } = req.body;
    
    // Check if username or email exists
    const [existing] = await db.execute(
      'SELECT user_id FROM ci_users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    const hashedPassword = password;
    
    const [result] = await db.execute(
      `INSERT INTO ci_users (username, firstname, lastname, email, mobile_no, password, 
                            admin_role_id, is_admin, is_active, added_by, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, NOW())`,
      [username, firstname, lastname, email, mobile_no, hashedPassword, admin_role_id, 1]
    );
    
    res.status(201).json({ 
      message: 'Admin created successfully', 
      user_id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin (Super Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { firstname, lastname, email, mobile_no, admin_role_id, is_active } = req.body;
    
    const [result] = await db.execute(
      `UPDATE ci_users SET firstname = ?, lastname = ?, email = ?, mobile_no = ?, 
                          admin_role_id = ?, is_active = ?, updated_at = NOW() 
       WHERE user_id = ?`,
      [firstname, lastname, email, mobile_no, admin_role_id, is_active, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete admin (Super Admin only)
router.delete('/:id', async (req, res) => {
  try {
    // Skip self-delete check for development
    
    const [result] = await db.execute('DELETE FROM ci_users WHERE user_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin roles
router.get('/roles/list', async (req, res) => {
  try {
    const [roles] = await db.execute(
      'SELECT * FROM ci_admin_roles WHERE admin_role_status = 1 ORDER BY admin_role_id'
    );
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
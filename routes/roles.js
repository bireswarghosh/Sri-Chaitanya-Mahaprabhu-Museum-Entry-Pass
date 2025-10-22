const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all roles
router.get('/', async (req, res) => {
  try {
    const [roles] = await db.execute('SELECT * FROM ci_admin_roles ORDER BY admin_role_id');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get role by ID
router.get('/:id', async (req, res) => {
  try {
    const [roles] = await db.execute('SELECT * FROM ci_admin_roles WHERE admin_role_id = ?', [req.params.id]);
    if (roles.length === 0) return res.status(404).json({ error: 'Role not found' });
    res.json(roles[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new role
router.post('/', async (req, res) => {
  try {
    const { admin_role_title, admin_role_status } = req.body;
    const [result] = await db.execute(
      'INSERT INTO ci_admin_roles (admin_role_title, admin_role_status, admin_role_created_by, admin_role_created_on) VALUES (?, ?, ?, NOW())',
      [admin_role_title, admin_role_status || 1, 1]
    );
    res.status(201).json({ message: 'Role created successfully', admin_role_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const { admin_role_title, admin_role_status } = req.body;
    const [result] = await db.execute(
      'UPDATE ci_admin_roles SET admin_role_title = ?, admin_role_status = ?, admin_role_modified_by = ?, admin_role_modified_on = NOW() WHERE admin_role_id = ?',
      [admin_role_title, admin_role_status, 1, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Role not found' });
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM ci_admin_roles WHERE admin_role_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
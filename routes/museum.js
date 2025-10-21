const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET all entries
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM museum_entry_2024 ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET entry by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM museum_entry_2024 WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Entry not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search by phone
router.get('/search/phone/:phone', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM museum_entry_2024 WHERE phone LIKE ?', [`%${req.params.phone}%`]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search by name
router.get('/search/name/:name', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM museum_entry_2024 WHERE firstname LIKE ?', [`%${req.params.name}%`]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search by date
router.get('/search/date/:date', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM museum_entry_2024 WHERE date = ?', [req.params.date]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multiple search filters
router.post('/search', async (req, res) => {
  try {
    const { phone, name, date, address } = req.body;
    let query = 'SELECT * FROM museum_entry_2024 WHERE 1=1';
    let params = [];

    if (phone) {
      query += ' AND phone LIKE ?';
      params.push(`%${phone}%`);
    }
    if (name) {
      query += ' AND firstname LIKE ?';
      params.push(`%${name}%`);
    }
    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }
    if (address) {
      query += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' ORDER BY id DESC';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Global search - search in all fields
router.get('/search/all/:query', async (req, res) => {
  try {
    const searchTerm = `%${req.params.query}%`;
    const [rows] = await db.execute(
      `SELECT * FROM museum_entry_2024 
       WHERE phone LIKE ? 
       OR firstname LIKE ? 
       OR address LIKE ? 
       OR total_amt LIKE ? 
       OR date LIKE ?
       OR txn_id LIKE ?
       ORDER BY id DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new entry (Public)
router.post('/public', async (req, res) => {
  try {
    const { 
      image_name, firstname, phone, address, gallery, checkbox_gallery,
      srivas_angan, checkbox_srivas_angan, jiva_uddhar, checkbox_jiva_uddhar,
      interactive_sankirtan, checkbox_interactive_sankirtan, vaishnav_philosophy,
      checkbox_vaishnav_philosophy, movie_show, checkbox_movie_show, num_of_persons,
      discount, free, txn_id, payment, select_all, total_amt
    } = req.body;
    
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    const [result] = await db.execute(
      `INSERT INTO museum_entry_2024 (
        date, time, image_name, firstname, phone, address, gallery, checkbox_gallery,
        srivas_angan, checkbox_srivas_angan, jiva_uddhar, checkbox_jiva_uddhar,
        interactive_sankirtan, checkbox_interactive_sankirtan, vaishnav_philosophy,
        checkbox_vaishnav_philosophy, movie_show, checkbox_movie_show, num_of_persons,
        discount, free, txn_id, payment, select_all, total_amt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        currentDate, currentTime, image_name || '', firstname, phone, address,
        gallery || '1', checkbox_gallery || 'on', srivas_angan || '1', checkbox_srivas_angan || 'on',
        jiva_uddhar || '1', checkbox_jiva_uddhar || 'on', interactive_sankirtan || '1',
        checkbox_interactive_sankirtan || 'on', vaishnav_philosophy || '1',
        checkbox_vaishnav_philosophy || 'on', movie_show || '0', checkbox_movie_show || '',
        num_of_persons || '1', discount || '0', free || '', txn_id || '', payment || '0',
        select_all || '', total_amt || '50'
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Entry created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new entry (Admin)
router.post('/', async (req, res) => {
  try {
    const { firstname, phone, address, num_of_persons, total_amt, payment, gallery, movie_show, discount, image_name, txn_id } = req.body;
    
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    const [result] = await db.execute(
      `INSERT INTO museum_entry_2024 (date, time, firstname, phone, address, num_of_persons, total_amt, payment, gallery, movie_show, discount, image_name, txn_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [currentDate, currentTime, firstname, phone, address, num_of_persons, total_amt, payment, gallery, movie_show, discount, image_name || '', txn_id || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Entry created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE entry
router.put('/:id', async (req, res) => {
  try {
    const { firstname, phone, address, num_of_persons, total_amt, payment, gallery, movie_show, discount, image_name, txn_id } = req.body;
    
    const [result] = await db.execute(
      `UPDATE museum_entry_2024 SET firstname=?, phone=?, address=?, num_of_persons=?, total_amt=?, payment=?, gallery=?, movie_show=?, discount=?, image_name=?, txn_id=? WHERE id=?`,
      [firstname, phone, address, num_of_persons, total_amt, payment, gallery, movie_show, discount, image_name, txn_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE entry
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM museum_entry_2024 WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
var express = require('express');
var router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'lukemccrae',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432, // Default PostgreSQL port
});

/* GET home page. */
router.get('/products', async function(req, res, next) {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows)
});

router.post('/products', async function(req, res, next) {
  console.log(req.body,'<< req body')

  const { serial_number, product_name, description, quantity, created_at } = req.body;

  const insertQuery = `
  INSERT INTO products (serial_number, product_name, description, quantity, created_at)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`;

  const values = [serial_number, product_name, description, quantity, created_at];
  console.log(values)

  try {
    const result = await pool.query(insertQuery, values);    
    res.json({ message: 'Data inserted successfully', insertedData: result.rows[0] });
  } catch (e) {
    console.log(e)
    res.status(500).send("database insert failed")
  }
});

module.exports = router;

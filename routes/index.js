var express = require('express');
var router = express.Router();
const { Pool } = require('pg');

const {randDrinks, randNumber, randProductDescription} = require('@ngneat/falso')

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

router.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { serial_number, product_name, description, quantity, created_at } = req.body;

  const updateQuery = `
    UPDATE products
    SET serial_number = $1, product_name = $2, description = $3, quantity = $4, created_at = $5
    WHERE id = $6
    RETURNING *;`;

  const values = [serial_number, product_name, description, quantity, created_at, productId];

  try {
    const result = await pool.query(updateQuery, values);
    if (result.rowCount > 0) {
      res.json({ message: `Product with ID ${productId} updated successfully`, updatedData: result.rows[0] });
    } else {
      res.status(404).json({ message: `Product with ID ${productId} not found` });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Internal Server Error');
  }
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

router.post('/random-product', async function(req, res, next) {
  console.log(req.body, '<< req body')
  
  // quantity - a random number of items in the inventory
  const randomProduct = {
    product_name: randDrinks(),
    serial_number: randNumber(),
    description: randProductDescription(),
    quantity: randNumber({ min: 10, max: 50 }),
    created_at: "2023-12-22T07:00:00.000Z"
    
  }

  const { serial_number, product_name, description, quantity, created_at } = randomProduct;

  const insertQuery = `
  INSERT INTO products (serial_number, product_name, description, quantity, created_at)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`;

  const values = [serial_number, product_name, description, quantity, created_at];

  try {
    const result = await pool.query(insertQuery, values);    
    res.json({ message: 'Data inserted successfully', insertedData: result.rows[0] });
  } catch (e) {
    console.log(e)
    res.status(500).send("database insert failed")
  }

})

module.exports = router;

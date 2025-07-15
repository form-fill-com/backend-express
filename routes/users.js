var express = require('express');
var router = express.Router();
const { User } = require('../models');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const users = await User.findAll();
    res.json(users); // Send list of users as JSON
  } catch (err) {
    next(err); // Pass errors to error handler
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation (optional)
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create user in the DB
    const user = await User.create({ name, email, password });

    // Optional: Hide password in response
    const { password: _pw, ...userWithoutPassword } = user.toJSON();

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    // Handle unique constraint error, etc.
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    next(err); // Pass error to default error handler
  }
});

module.exports = router;

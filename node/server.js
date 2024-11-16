const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const plaidRoutes = require('./routes/plaidRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/plaid', plaidRoutes);
app.use('/auth', authRoutes);
console.log('Auth routes are set up');
const APP_PORT = process.env.APP_PORT || 8000;

app.get('/', async (req, res) => {
  res.send('Welcome to the plaid integration app');
});
app.listen(APP_PORT, () =>
  console.log(
    `plaid-quickstart server listening on http://localhost:${APP_PORT}`,
  ),
);

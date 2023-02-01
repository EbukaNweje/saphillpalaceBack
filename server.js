const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


require('dotenv').config({
  path: './config/index.env',
});
// MongoDB
require('./config/db');





// routes
app.use('/user/', require('./routes/auth.route'));
app.use('/api/Seller/', require('./routes/seller.route'));
app.use('/api/Order/', require('./routes/order.route'));


app.get('/', (req, res) => {
  res.send('test route => home page');
});

// Page Not founded
app.use((req, res) => {
  res.status(404).json({
    msg: 'Page not found',
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App connected!`);
});

// Thanks for watching

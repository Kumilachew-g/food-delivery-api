const mongoose = require('mongoose');

var mongoURL =
  'mongodb+srv://haddis:Haddis%4011to@cluster0.0nrln3h.mongodb.net/food-delivery';
mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.log('Error in connecting MongoDB', err);
});

module.exports = mongoose;

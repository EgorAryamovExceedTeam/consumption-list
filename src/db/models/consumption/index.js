const mongoose = require('mongoose');

const { Schema } = mongoose;

const consumptionScheme = new Schema({
  text: String,
  cost: String,
  date: String
});

module.exports = Consumption = mongoose.model('consumption', consumptionScheme)
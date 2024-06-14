const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  desc: String,
  amount: Number,
  date: String,
  time: String,
});

const customerSchema = new mongoose.Schema({
  uid: mongoose.Schema.ObjectId,
  cusname: String,
  profile: String,
  star: Boolean,
  note: String,
  transaction: [transactionSchema],
});

const customerModel = mongoose.model("Customer", customerSchema);

module.exports = customerModel;

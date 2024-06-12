const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  desc: String,
  amount: Number,
  date: String,
  time: String,
});

const customerSchema = new mongoose.Schema({
  cusname: String,
  uid: mongoose.Schema.ObjectId,
  profile: String,
  note: String,
  star: Boolean,
  transaction: [transactionSchema],
});

const customerModel = mongoose.model("Customer", customerSchema);

module.exports = customerModel;

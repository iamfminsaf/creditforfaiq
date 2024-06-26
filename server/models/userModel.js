const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	uname: { type: String, required: true, unique: true },
	pwd: { type: String, required: true },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

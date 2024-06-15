const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const customerRouter = require('./routes/customerRoutes');

require('dotenv').config();
const { FRONTEND, DB_URI, PORT } = process.env;

const uploadDir = path.join(__dirname, 'profile');

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

app.use(cors({ origin: FRONTEND }));
app.use(express.json());

app.use('/profile', express.static(uploadDir));
app.use('/api/user', userRouter);
app.use('/api/cus', customerRouter);

mongoose
	.connect(DB_URI)
	.then(() => {
		console.log('DB connected successfully!!');

		app.listen(PORT, (err) => {
			if (err) {
				console.log('Error while running server : ', err);
			}
			console.log(`Server is running in port : ${PORT}`);
		});
	})
	.catch((err) => {
		console.log('Error connecting db : ', err);
	});

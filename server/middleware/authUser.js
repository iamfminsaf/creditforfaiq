const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
			return res.status(401).json({ msg: 'token must be send' });
		}

		const validated = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		if (!validated) {
			return res.status(401).json({ authenticated: false, msg: 'unauthorized' });
		}
		req.user = validated;
		next();
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'something wrong' });
	}
};

module.exports = authUser;

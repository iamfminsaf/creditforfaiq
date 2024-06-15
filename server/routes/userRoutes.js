const { joinUser, verifyUser } = require('../controllers/userController');

const Router = require('express').Router();

Router.route('/join').post(joinUser);
Router.route('/verify').post(verifyUser);

module.exports = Router;

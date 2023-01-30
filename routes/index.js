var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const authentication = require("../functions/authentication.js");

router.get('/', indexController.index_get);

router.get('/Login', loginController.login_get);

router.post('/LoginValida', loginController.login_post);

router.get('/Register', registerController.register_get);

router.post('/RegisterValida', registerController.register_post);

router.get('/Logout', authentication.isAuth, loginController.logout_get);


module.exports = router;
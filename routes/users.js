var express = require('express');
var router = express.Router();

const profileController = require('../controllers/profileController');

const indexController = require('../controllers/indexController')
const authentication = require("../functions/authentication.js");

router.get('/', indexController.index_get);

router.get('/MyProfile', authentication.isAuth, profileController.profile_get);

router.get('/ValidarCorreoElectronico', authentication.isAuth, profileController.validarCorreo_get);

router.post('/ValidarCorreo', authentication.isAuth, profileController.validarCorreo_post);


module.exports = router;

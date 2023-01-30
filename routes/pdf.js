var express = require('express');
var router = express.Router();

const pdfController = require('../controllers/pdfController');
const authentication = require("../functions/authentication.js");

router.get('/pdf', authentication.isAuth, pdfController.generaPDF_get);

module.exports = router;
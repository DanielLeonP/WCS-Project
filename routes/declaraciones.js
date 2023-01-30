var express = require('express');
var router = express.Router();

const declaracionController = require('../controllers/declaracionController');
const formController = require('../controllers/formController');
const authentication = require("../functions/authentication.js");

//Multer
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).array('myFiles', 20);


router.get('/HomePage', authentication.isAuth, declaracionController.HomePage_get);

router.get('/NuevaDeclaracion', authentication.isAuth, declaracionController.NuevaDeclaracion_get);

router.post('/NuevaDeclaracion', authentication.isAuth, declaracionController.NuevaDeclaracion_post);

router.get('/FormularioDeclaracion', authentication.isAuth, formController.form_get);

router.get('/DeclaracionesPendientes', authentication.isAuth, declaracionController.DeclaracionesPendientes_get);

router.get('/MisDeclaraciones', authentication.isAuth, declaracionController.MisDeclaraciones_get);

router.get('/ResultadoDeclaracion', authentication.isAuth, declaracionController.ResultadoDeclaracion_get);

router.get('/Desglose/:idDeclaracion', authentication.isAuth, declaracionController.desglose_get);

router.get('/CambiarEstatus', authentication.isAuth, declaracionController.cambiarEstatus_get);

router.get('/AgregarDeduccion', authentication.isAuth, uploadStrategy, declaracionController.agregarDeduccion_get);
//Envia el formulario y todos los archivos los sube a azure
router.post('/formularioTerminado', authentication.isAuth, uploadStrategy, formController.form_post);

router.get('/Guia', authentication.isAuth, declaracionController.guia_get);

module.exports = router;

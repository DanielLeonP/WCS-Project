var express = require('express');
var router = express.Router();
const authentication = require("../functions/authentication.js");
const { createOrder, capturePayment } = require('../controllers/paypalController');

router.post("/crearPago", async (req, res) => {
    req.session.monto = req.body.monto
    if (req.session.monto > 0) {
        const order = await createOrder(req.session.monto);
        const { links } = order;
        res.redirect(links[1].href);
    } else {
        req.session.monto = 0;
        res.redirect('/CambiarEstatus');
    }


});

router.get("/capturar", async (req, res) => {
    const { token, PayerID } = req.query;
    console.log(token)
    const captureData = await capturePayment(token) //paypal.capturePayment(orderId);
    res.redirect('/CambiarEstatus');
});

module.exports = router;
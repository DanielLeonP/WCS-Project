const fetch = require('node-fetch');
require('dotenv/config');

const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const createOrder = async (monto = 0) => {
    port = process.env.PORT || 3000;
    host =
        process.env.NODE_ENV === "production"
            ? process.env.HOST
            : "http://localhost:" + port
    console.log(host)
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "MXN",
                        value: monto * 0.2,
                    },
                },
            ],
            application_context: {
                brand_name: host,
                landing_page: 'NO_PREFERENCE', // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
                user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
                return_url: `${host}/capturar`,//`http://localhost:3000/capturar`, // Url despues de realizar el pago
                cancel_url: `${host}`,//`http://localhost:3000/cancel-payment` // Url despues de realizar el pago
            }
        }),
    });

    const data = await response.json();
    console.log(data);
    return data;
}
const capturePayment = async (OrderId) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${OrderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    console.log(data);
    return data;
}
const generateAccessToken = async () => {
    const response = await fetch(base + "/v1/oauth2/token", {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization:
                "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64"),
        },
    });
    const data = await response.json();
    return data.access_token;
}
module.exports = {
    createOrder,
    capturePayment
}















// const database = require("../config/database/db.js");
// const request = require('request');

// export const createOrder = async (req, res) => {
//     try {
//         const order = {
//             intent: "CAPTURE",
//             purchase_units: [
//                 {
//                     amount: {
//                         currency_code: "USD",
//                         value: "105.70",
//                     },
//                 },
//             ],
//             application_context: {
//                 brand_name: "mycompany.com",
//                 landing_page: "NO_PREFERENCE",
//                 user_action: "PAY_NOW",
//                 return_url: `${HOST}/capture-order`,
//                 cancel_url: `${HOST}/cancel-payment`,
//             },
//         };


//         // format the body
//         const params = new URLSearchParams();
//         params.append("grant_type", "client_credentials");

//         // Generate an access token
//         const {
//             data: { access_token },
//         } = await axios.post(
//             "https://api-m.sandbox.paypal.com/v1/oauth2/token",
//             params,
//             {
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 auth: {
//                     username: PAYPAL_API_CLIENT,
//                     password: PAYPAL_API_SECRET,
//                 },
//             }
//         );

//         console.log(access_token);

//         // make a request
//         const response = await axios.post(
//             `${PAYPAL_API}/v2/checkout/orders`,
//             order,
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`,
//                 },
//             }
//         );

//         console.log(response.data);

//         return res.json(response.data);
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json("Something goes wrong");
//     }
// };

// export const captureOrder = async (req, res) => {
//     const { token } = req.query;

//     try {
//         const response = await axios.post(
//             `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
//             {},
//             {
//                 auth: {
//                     username: PAYPAL_API_CLIENT,
//                     password: PAYPAL_API_SECRET,
//                 },
//             }
//         );

//         console.log(response.data);

//         res.redirect("/payed.html");
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ message: "Internal Server error" });
//     }
// };

// export const cancelPayment = (req, res) => {
//     res.redirect("/");
// }



// // const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Live https://api-m.paypal.com

// // const auth = { user: process.env.PAYPALCLIENTID, pass: process.env.PAYPALSECRET }

// // exports.createPayment = (req, res) => {
// //     console.log(process.env.PAYPALCLIENTID);
// //     console.log(process.env.PAYPALSECRET)
// //     const body = {
// //         intent: 'CAPTURE',
// //         purchase_units: [{
// //             amount: {
// //                 currency_code: 'MEX', //https://developer.paypal.com/docs/api/reference/currency-codes/
// //                 value: req.body.monto
// //             }
// //         }],
// //         application_context: {
// //             brand_name: `sb-1kuyo24859789@business.example.com`,
// //             landing_page: 'NO_PREFERENCE', // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
// //             user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
// //             return_url: `http://localhost:3000/ejecutarPago`, // Url despues de realizar el pago
// //             cancel_url: `http://localhost:3000/cancel-payment` // Url despues de realizar el pago
// //         }
// //     }
// //     //https://api-m.sandbox.paypal.com/v2/checkout/orders [POST]
// //     // res.redirect(`${PAYPAL_API}/v2/checkout/orders`);
// //     request.post(`${PAYPAL_API}/v2/checkout/orders`, {
// //         auth,
// //         body,
// //         json: true
// //     }, (err, response) => {
// //         res.json({ data: response.body })
// //     })
// // }

// // exports.executePayment = (req, res) => {
// //     const token = req.query.token; //<-----------

// //     request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
// //         auth,
// //         body: {},
// //         json: true
// //     }, (err, response) => {
// //         res.json({ data: response.body })
// //     })
// // }

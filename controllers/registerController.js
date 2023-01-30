const nodemailer = require('nodemailer');

const database = require("../config/database/db.js");

exports.register_get = (req, res, next) => {
    if (req.session.correo) {
        res.redirect('/HomePage');
    } else {
        res.render('Register', { title: 'Pagina de Register' });
    }
}

exports.register_post = (req, res, next) => {

    //Genera Numero aleatorio para codigo
    var min = 99999;
    var max = 10000;
    var Codigo = Math.floor(Math.random() * (max - min + 1) + min);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPSSWD
        }
    });
    let mail_options = {
        from: 'WCS',
        to: req.body.correo,
        subject: 'Bienvenido a la aplicación',
        html: `
            <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
                <tr height="200px">  
                    <td bgcolor="" width="600px">
                        <h1 style="color: #fff; text-align:center">Bienvenido ${req.body.nombre}</h1>
                        <p  style="color: #fff; text-align:center">
                            Tu correo <span style="color: #e84393"> ${req.body.correo}</span> ha sido registrado en la aplicación.
                        </p>
                        <br>
                        <h2 style="color: #fff; text-align:center">El código de validación es ${Codigo}<h2>
                    </td>
                </tr>
            </table>
        `
    };

    db = database.conectar();
    sql = "INSERT INTO Usuario (Nombre, Correo, RFC, Contrasena, Validacion, Codigo)  VALUES ('" + req.body.nombre + "', '" + req.body.correo + "', '" + req.body.rfc + "', '" + req.body.contrasena + "','n','" + Codigo + "');";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                console.log("Error " + err.code);
                if (err.code == "ER_DUP_ENTRY") {
                    res.send('<script>alert("El Correo o RFC ya se encuentra registrado con una cuenta"); window.location.href = "/Register"; </script>');
                }
            } else {
                transporter.sendMail(mail_options, (error, info) => {
                    if (error) {
                        console.log(error);
                    }
                });
                req.session.correo = req.body.correo;
                req.session.Validacion = "n";
                req.session.idUsuario = result.insertId;
                res.send('<script>alert("Se envió un código de validación a tu correo, tienes hasta 3 días para validar el código, sino tu cuenta será cancelada automáticamente"); window.location.href = "/HomePage"; </script>');
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}
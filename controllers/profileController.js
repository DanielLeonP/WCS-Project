const database = require("../config/database/db.js");

exports.profile_get = (req, res, next) => {
    db = database.conectar();
    sql = "SELECT * FROM Usuario WHERE Correo = '" + req.session.correo + "';";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                result = result[0];
                res.render('myProfile', { result });
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}

exports.validarCorreo_get = (req, res, next) => {

    if (req.session.Validacion) {
        res.render('validarCorreo', { Correo: req.session.correo });
    } else {
        res.redirect('/HomePage');
    }
}

exports.validarCorreo_post = (req, res, next) => {
    if (req.session.Validacion) {
        db = database.conectar();
        sql = "SELECT Codigo FROM Usuario WHERE Correo = '" + req.session.correo + "';";
        db.query(sql,
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                } else {
                    if (req.body.codigo == result[0].Codigo) {
                        db2 = database.conectar();
                        sql = "UPDATE Usuario SET Validacion='s' WHERE Correo ='" + req.session.correo + "';";
                        db2.query(sql,
                            function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.session.Validacion = false;
                                    res.send('<script>alert("Código de verificación valido, Bienvenido"); window.location.href = "/HomePage"; </script>');
                                }
                            })
                        db2.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
                    } else {
                        res.send('<script>alert("Código de verificación invalido, intentalo de nuevo"); window.location.href = "/ValidarCorreoElectronico"; </script>');
                    }
                }
            })
        db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
    } else {
        res.redirect('/HomePage');
    }
}
const database = require("../config/database/db.js");

exports.login_get = (req, res, next) => {
    if (req.session.correo) {
        res.redirect('/HomePage');
    } else {
        res.render('login', { title: 'Pagina de Login' });
    } 
}

exports.logout_get = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}

exports.login_post = (req, res, next) => {
    db = database.conectar();
    sql = "SELECT * FROM Usuario WHERE Correo = '" + req.body.correo + "' AND Contrasena = '" + req.body.contrasena + "';";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                //console.log(result[0]);
                if (result.length > 0) {
                    req.session.correo = result[0].Correo;
                    req.session.idUsuario = result[0].idUsuario;
                    // console.log(result[0].Validacion)
                    if (result[0].Validacion == "n") {
                        req.session.Validacion = result[0].Validacion;
                    }
                    res.redirect('/HomePage');
                } else {
                    res.send('<script>alert("Datos Incorrectos"); window.location.href = "/Login"; </script>');
                }
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}
const database = require("../config/database/db.js");

exports.generaPDF_get = (req, res, next) => {
    db = database.conectar();
    sql = " SELECT * FROM Declaracion WHERE idDeclaracion = 1";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                result = result[0];
                res.send("Generando el pdf")
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}
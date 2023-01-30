const mysql = require('mysql');

function conectar() {
    var config =
    {
        host: 'wcs-database.mysql.database.azure.com',
        user: 'Administrador',
        password: 'WCSProyectoAPS123',
        database: 'WCSDB',
        port: 3306,
    };
    const db = new mysql.createConnection(config);
    db.connect(
        function (err) {
            if (err) {
                console.log("!!! No se pudo conectar !!! Error:");
                throw err;
            }
            else {
                console.log("Conexion establecida a la base de datos.");
            }
        });
    return db;
};

module.exports = {
    "conectar": conectar,
}

// Usuario:
// Administrador
// Contraseña:
// WCSProyectoAPS123
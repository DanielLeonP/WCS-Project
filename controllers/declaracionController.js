const database = require("../config/database/db.js");

exports.HomePage_get = (req, res, next) => {

    if (req.session.Validacion) {
        res.render('homePage', { title: 'Homepage', CodigoValidacion: true });
    } else {
        res.render('homePage', { title: 'Homepage', CodigoValidacion: false });
    }

}

exports.NuevaDeclaracion_get = (req, res, next) => {
    const anoActual = new Date().getFullYear()
    nombreDeclaracion = "Declaración " + anoActual;
    db = database.conectar();
    sql = "SELECT * FROM Usuario WHERE Correo = '" + req.session.correo + "';";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                result = result[0];
                res.render('nuevaDeclaracion', { title: 'Pagina de nueva declaracion', user: result, nombreDeclaracion: nombreDeclaracion, anoActual: anoActual });
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}
exports.NuevaDeclaracion_post = (req, res, next) => {
    idUsuario = req.session.idUsuario;
    monto_remunerado = 0;//Sera  0 por defecto por que se esta solo creando la declaracion
    estatus = "Creado"; //el estatus sera creado, pasara a pendiente cuando se llene el formulario
    nombre = req.body.nombre;
    periodo = req.body.periodo;
    tipo = req.body.tipoDeclaracion;
    regimen = req.body.regimen;

    db = database.conectar();

    sql = "INSERT INTO Declaracion (idUsuario, Nombre, Periodo, Tipo, Monto_remunerado, Estatus, Regimen)  VALUES ('" + idUsuario + "', '" + nombre + "', '" + periodo + "', '" + tipo + "', '" + monto_remunerado + "', '" + estatus + "','" + regimen + "');";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                console.log("Error " + err.code);
            } else {
                req.session.idDeclaracion = result.insertId;
                res.redirect("/FormularioDeclaracion");// + result.insertId
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });

}

exports.DeclaracionesPendientes_get = (req, res, next) => {
    db = database.conectar();
    sql = "SELECT idDeclaracion, Nombre, Periodo, Tipo FROM Declaracion WHERE idUsuario IN (SELECT IdUsuario FROM Usuario WHERE Correo = '" + req.session.correo + "') AND Estatus = 'Pendiente';";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                res.render('declaracionesPendientes', { DPendientes: result });
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}

exports.MisDeclaraciones_get = (req, res, next) => {
    db = database.conectar();
    sql = "SELECT idDeclaracion, Nombre, CONCAT(DAY(FechaRealizada),'/',MONTH(FechaRealizada),'/',YEAR(FechaRealizada)) AS FechaRealizada, Periodo, Tipo, Monto_remunerado FROM Declaracion WHERE idUsuario IN (SELECT IdUsuario FROM Usuario WHERE Correo = '" + req.session.correo + "') AND Estatus = 'Completado';";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                res.render('misDeclaraciones', { DPendientes: result });
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}

exports.ResultadoDeclaracion_get = (req, res, next) => {
    db = database.conectar();
    sql = "SELECT idDeclaracion, Nombre, Periodo, Monto_remunerado FROM Declaracion WHERE idDeclaracion = '" + req.session.idDeclaracion + "';";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                result = result[0];
                idDeclaracion = result.idDeclaracion;
                Nombre = result.Nombre
                Periodo = result.Periodo
                Monto_remunerado = result.Monto_remunerado

                res.render('resultadoDeclaracion', { idDeclaracion, Nombre, Periodo, Monto_remunerado });
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}


exports.desglose_get = (req, res, next) => {
    idDeclaracion = req.params.idDeclaracion;

    db = database.conectar();
    sql = "SELECT * FROM Usuario WHERE idUsuario = '" + req.session.idUsuario + "';";
    db.query(sql,
        function (err, resultadoUsuario, fields) {
            if (err) {
                console.log(err);
            } else {
                resultadoUsuario = resultadoUsuario[0];
                db = database.conectar();
                sql = "SELECT * FROM Declaracion WHERE idDeclaracion = '" + idDeclaracion + "';";
                db.query(sql,
                    function (err, resultadoDeclaracion, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            resultadoDeclaracion = resultadoDeclaracion[0];
                            Monto_remunerado = resultadoDeclaracion.Monto_remunerado;
                            salario = resultadoDeclaracion.salario;
                            salario = salario * 52;
                            limite = [0, 644 * 12, 5470 * 12, 9614 * 12, 11176 * 12, 13381 * 12, 26988 * 12, 42537 * 12, 81281 * 12, 108281 * 12, 324845 * 12]
                            cuota = 0;
                            porcentaje = 0;
                            limiteInferior = 0;

                            if (salario > limite[0] && salario <= limite[1]) {
                                cuota = 0;
                                porcentaje = 1.92;
                                limiteInferior = limite[0];
                                // limiteSuperior = limite[1];
                            }
                            if (salario > limite[1] && salario <= limite[2]) {
                                cuota = 12.38 * 12;
                                porcentaje = 6.40;
                                limiteInferior = limite[1];
                                // limiteSuperior = limite[2];
                            }
                            if (salario > limite[2] && salario <= limite[3]) {
                                cuota = 321.26 * 12;
                                porcentaje = 10.88;
                                limiteInferior = limite[2];
                                // limiteSuperior = limite[3];
                            }
                            if (salario > limite[3] && salario <= limite[4]) {
                                cuota = 772.10 * 12;
                                porcentaje = 16;
                                limiteInferior = limite[3];
                                // limiteSuperior = limite[4];
                            }
                            if (salario > limite[4] && salario <= limite[5]) {
                                cuota = 1022.01 * 12;
                                porcentaje = 17.92;
                                limiteInferior = limite[4];
                                // limiteSuperior = limite[5];
                            }
                            if (salario > limite[5] && salario <= limite[6]) {
                                cuota = 1417.12 * 12;
                                porcentaje = 21.36;
                                limiteInferior = limite[5];
                                // limiteSuperior = limite[6];
                            }
                            if (salario > limite[6] && salario <= limite[7]) {
                                cuota = 4323.58 * 12;
                                porcentaje = 23.52;
                                limiteInferior = limite[6];
                                // limiteSuperior = limite[7];
                            }
                            if (salario > limite[7] && salario <= limite[8]) {
                                cuota = 7980 * 73 * 12;
                                porcentaje = 30;
                                limiteInferior = limite[7];
                                // limiteSuperior = limite[8];
                            }
                            if (salario > limite[8] && salario <= limite[9]) {
                                cuota = 19582.83 * 12;
                                porcentaje = 32;
                                limiteInferior = limite[8];
                                // limiteSuperior = limite[9];
                            }
                            if (salario > limite[9] && salario <= limite[10]) {
                                cuota = 28245.35 * 12;
                                porcentaje = 34;
                                limiteInferior = limite[9];
                                // limiteSuperior = limite[10];
                            }
                            if (salario > limite[10]) {
                                cuota = 101876.90 * 12;
                                porcentaje = 35;
                                limiteInferior = limite[10];
                                limiteSuperior = limite[0];
                            }

                            IngresoAplicar = salario - limiteInferior;
                            ISRPorcentaje = IngresoAplicar * porcentaje;
                            // ISRPagado = 3000; //DEFINIR
                            ISRTotalPagar = cuota - ISRPorcentaje;

                            IngresoConDedudccion = IngresoAplicar - Monto_remunerado;
                            NISR = porcentaje * IngresoConDedudccion;
                            ISRDebiaPagar = cuota + NISR;
                            DevolucionTotal = ISRTotalPagar - ISRDebiaPagar;
                            db = database.conectar();
                            sql = "SELECT * FROM Deduccion WHERE idDeclaracion = '" + idDeclaracion + "';";
                            db.query(sql,
                                function (err, resultadoDeducciones, fields) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        tipoImpuestos = ['Impuestos en el extranjero', 'Servicios médicos', 'Gastos médicos', 'Servicios funerarios', 'Aparatos ópticos', 'Aportaciones voluntarias', 'Créditos hipotecarios', 'Donaciones'];
                                        for (let b = 0; b < resultadoDeducciones.length; b++) {
                                            if (resultadoDeducciones[b].idImpuesto == 1) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[0];
                                            }
                                            if (resultadoDeducciones[b].idImpuesto == 2) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[1];
                                            }
                                            if (resultadoDeducciones[b].idImpuesto == 3) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[2];
                                            }
                                            if (resultadoDeducciones[b].idImpuesto == 4) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[3];
                                            }
                                            if (resultadoDeducciones[b].idImpuesto == 5) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[4];
                                            }
                                            if (resultadoDeducciones[b].idImpuesto == 6) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[5];
                                            }
                                            if (resultadoDeducciones[b].idImpuesto == 7) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[6];
                                            }
                                            if (resultadoDeducciones[b].idImpuesto == 8) {
                                                resultadoDeducciones[b].idImpuesto = tipoImpuestos[7];
                                            }
                                        }
                                        req.session.idDeclaracion = resultadoDeclaracion.idDeclaracion;
                                        res.render('desglose', { Usuario: resultadoUsuario, Declaracion: resultadoDeclaracion, Deducciones: resultadoDeducciones, DevolucionTotal });
                                    }
                                })
                            db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
                        }
                    })
                db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}


exports.cambiarEstatus_get = (req, res, next) => {
    monto_remunerado = req.session.monto;
    
    db = database.conectar();
    sql = "UPDATE Declaracion SET Estatus = 'Completado' WHERE idDeclaracion = " + req.session.idDeclaracion + ";";
    db.query(sql,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                console.log("Error " + err.code);
            } else {
                res.redirect("/Desglose/" + req.session.idDeclaracion);
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}

exports.guia_get = (req, res, next) => {
    res.render('guia');
}

exports.agregarDeduccion_get = (req, res, next) => {
    res.redirect("/FormularioDeclaracion");
}
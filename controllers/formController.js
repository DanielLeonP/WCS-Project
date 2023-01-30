const database = require("../config/database/db.js");

//COSAS QUE SE REQUIEREN PARA OBTENER ARCHIVOS DESDE FORMULARIO
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const { BlockBlobClient } = require('@azure/storage-blob');
const getStream = require('into-stream');
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const handleError = (err, res) => {
    res.status(500);
    console.error(err)
    res.render('error', { error: err });
};
const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};


exports.form_post = (req, res, next) => {
    salario = req.body.salario;
    console.log({ salario })
    console.log("Cantidad de archivos " + req.files.length);

    // console.log(req.body);
    // req.body.fuenteIngresos
    // req.body.ingresosTotal



    montos = req.body.monto;
    tipoImpuesto = req.body.tipoImpuesto;


    /*   MONTO REMUNERADO SE CALCULA BASANDOSE EN LOS DATOS INGRESADOS EN EL FORMULARIO, este se usa en insert declaracion*/
    monto_remunerado = 0;
    db = database.conectar();
    sql = "SELECT Monto_remunerado FROM Declaracion WHERE idDeclaracion = '" + req.session.idDeclaracion + "';";
    db.query(sql,
        function (err, DeclaracionResult, fields) {
            if (err) {
                console.log(err);
                console.log("Error " + err.code);
            } else {
                // console.log("-------------------El monto anterior es " + DeclaracionResult[0].Monto_remunerado);
                monto_remunerado = Number(DeclaracionResult[0].Monto_remunerado);


                //Caltular monto remunerado total
                if (req.files.length == 1) {
                    monto_remunerado = Number(montos) + monto_remunerado;
                } else {
                    for (let i = 0; i < montos.length; i++) {
                        monto_remunerado = Number(montos[i]) + monto_remunerado; //SE AUMENTA MONTO TOTAL PARA PONER EL MONTO REMUNERADO EN LA DECLARACION
                        // console.log("-------------------Entra a  array")
                    }
                    // console.log("-------------------El nuevo monto es " + monto_remunerado)
                }




                for (let a = 0; a < req.files.length; a++) {
                    const blobName = getBlobName(req.files[a].originalname);
                    const blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, blobName);
                    const stream = getStream(req.files[a].buffer);
                    const streamLength = req.files[a].buffer.length;

                    blobService.uploadStream(stream, streamLength)
                        .then(
                            () => {
                                console.log('El archivo se subio a azure.');
                                facturas = "Factura" //https://cuentaalmacenamientowcs.blob.core.windows.net/containerwcs/016794973353607023-archivo5.pdf
                                link = "https://cuentaalmacenamientowcs.blob.core.windows.net/containerwcs/" + blobName;
                                idImpuesto = tipoImpuesto[a];
                                if (req.files.length == 1) {
                                    cantidad = montos;
                                } else {
                                    cantidad = montos[a];
                                }

                                idDeclaracion = req.session.idDeclaracion;

                                db = database.conectar();
                                sql = "INSERT INTO Deduccion (Facturas, Cantidad, Link, idImpuesto, idDeclaracion)  VALUES ('" + facturas + "', '" + cantidad + "', '" + link + "', '" + idImpuesto + "','" + idDeclaracion + "');";
                                db.query(sql,
                                    function (err, result, fields) {
                                        if (err) {
                                            console.log(err);
                                            console.log("Error " + err.code);
                                        }
                                    })
                                db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
                            }
                        ).catch(
                            (err) => {
                                if (err) {
                                    handleError(err);
                                    console.log(err);
                                    return;
                                }
                            }
                        )
                }

                db = database.conectar();
                sql = "UPDATE Declaracion SET Estatus = 'Pendiente', Monto_remunerado = '" + monto_remunerado + "', salario = '" + salario + "' WHERE idDeclaracion = " + req.session.idDeclaracion + ";";
                db.query(sql,
                    function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            console.log("Error " + err.code);
                        } else {
                            res.redirect('/ResultadoDeclaracion');
                        }
                    })
                db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
            }
        })
    db.end(function (err) { err ? console.log(err) : console.log('Conexión terminada.'); });
}

exports.form_get = (req, res, next) => {
    res.render('form', { title: 'Pagina de formulario' });
}

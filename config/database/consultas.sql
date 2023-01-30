DROP DATABASE WCSDB;

CREATE DATABASE WCSDB;
USE WCSDB;

CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT, 
    Nombre VARCHAR(60) NOT NULL,
    Correo VARCHAR(50) NOT NULL UNIQUE,
    RFC VARCHAR(13) NOT NULL UNIQUE,
    Contrasena VARCHAR(30) NOT NULL,
    Validacion char(1) NOT NULL,
    Codigo INT(5) NOT NULL,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM Usuario;

INSERT INTO Usuario (Nombre, Correo, RFC, Contrasena, Validacion, Codigo) VALUES ('Prueba', 'r@gmail.com', 'PSJ1205421', 'r', 's', '11111');

SELECT * FROM Usuario;

CREATE TABLE Declaracion (
    idDeclaracion INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT NOT NULL, 
    Nombre VARCHAR(80) NOT NULL,
    Periodo INT NOT NULL,
    Tipo VARCHAR(30), 
    Monto_remunerado FLOAT NOT NULL,
    Estatus VARCHAR(30) NOT NULL,  /* Completado, Pendiente y Creado (cuando se inicializa una nueva declaracion) */
    FechaRealizada DATETIME DEFAULT CURRENT_TIMESTAMP,
    Regimen VARCHAR(50) NOT NULL,
    salario INT NOT NULL DEFAULT 0

);

SELECT * FROM Declaracion;

CREATE TABLE Deduccion (
    idDeduccion INT PRIMARY KEY AUTO_INCREMENT,
    Facturas VARCHAR(250) NOT NULL, 
    Cantidad FLOAT NOT NULL,
    Link VARCHAR(250) NOT NULL,
    idImpuesto INT NOT NULL,
    idDeclaracion INT NOT NULL
);

CREATE TABLE Impuesto (
    idImpuesto INT PRIMARY KEY,
    Nombre VARCHAR(250) NOT NULL
);
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 1, 'Impuestos en el extranjero');
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 2, 'Servicios médicos');
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 3, 'Gastos médicos');
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 4, 'Servicios funerarios');
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 6, 'Aparatos ópticos');
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 7, 'Aportaciones voluntarias');
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 8, 'Créditos hipotecarios');
INSERT INTO Impuesto (idImpuesto, Nombre) VALUES ( 9, 'Donaciones');

USE WCSDB;

SELECT * FROM Usuario;

SELECT * FROM declaracion;

SELECT * FROM Deduccion;

SELECT * FROM Impuesto;
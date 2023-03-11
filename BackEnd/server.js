/* Importación de bibliotecas */
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
var debuger = require('debug');
var debug = debuger('server:app');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/',express.static(path.join(__dirname,"public/imagenes")));
app.use('/',express.static(path.join(__dirname,'public')));
app.use(bodyParser.text());
const port = process.env.npm_package_config_port || '8080';
app.set('port', port);

/* Importación de los enrutadores */
const clientes_router		= require(path.join(__dirname,'routes','cliente'));
const administrador_router	= require(path.join(__dirname,'routes','administrador'));
const usuarios_router		= require(path.join(__dirname,'routes','usuarios'));
const tienda_router		= require(path.join(__dirname,'routes','tienda'));
const non_register		= require(path.join(__dirname,'routes','nonregister'));

/* Configuraciones */
/* Sesiones */
app.use(session({
	secret: 'indestructible_password',
	resave: false,
	saveUninitialized: true
}));

/* Enrutadores */
app.use("/",			non_register	);
app.use("/clientes",		clientes_router		);
app.use("/administrador",	administrador_router	);
app.use("/usuarios",		usuarios_router	);
app.use("/tienda",		tienda_router	);

const server = http.createServer(app);
server.listen(port);
console.log( "Servidor escuchando peticiones en puerto " + port ); 

const http = require('http');

const express = require('express');
const app = express();
const router = express.Router();

const db = require('./db');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));

/* Importación de los enrutadores */
const clientes_router		= require(path.join(__dirname,'routes','cliente');
const administrador_router	= require(path.join(__dirname,'routes','admintrador');
const vendedor_router		= require(path.join(__dirname,'routes','vendedor');

/* Configuraciones */
/* Enrutadores */
app.use("/clientes",		clientes_router		);
app.use("/administrador",	administrador_router	);
// Dejaremos este modulo para el final si es que queda suficiente tiempo
// app.use("/vendedor",		vendedor_router		);

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/* Importación de bibliotecas */
import http from "node:http";
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

/* Importación de los enrutadores */
import root			from './routes/root.js';

const app = express();
const port = process.env.npm_package_config_port || '8080';

/* Configuaración del servidor */
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.set('port', port);

/* Configuraciones */
/* Sesiones */
app.use(session({
	secret: 'indestructible_password',
	resave: false,
	saveUninitialized: true
}));

/* Enrutadores */
app.use("/", root);

// Error handler
app.use((err, req, res, next) => {
	if( err.name == "NotCodedYet" ) res.status(501);
	else if( err.status ) res.status(err.status);
	else res.status(500);
	res.send();
	console.error(err);
	fs.writeFile(
		process.env.npm_package_config_errlogfile,
		JSON.stringify([ err, req, res ]),
		{ flag: 'a' }
	);
})

const server = http.createServer(app);
server.listen(port);
console.log( "Servidor escuchando peticiones en puerto " + port ); 

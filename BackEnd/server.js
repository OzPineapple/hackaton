/* Importación de bibliotecas */
import http from "node:http";
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import debuger from 'debug';
import cors from 'cors';

/* Importación de los enrutadores */
import root from './routes/root.js';
import admin from './routes/admin.js';

const app = express();
const port = process.env.npm_package_config_port || '8080';
const debug = debuger("server:");
const logerr = debuger("server:global_err_handler");

/* Configuaración del servidor */
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(cors());
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
app.use("/admin", admin);

// Error handler
app.use((err, req, res, next) => {
	if( err.name == "NoCodedYet" ) res.status(501);
	else if( err.status ) res.status(err.status);
	else res.status(500);
	res.send();
	logerr(err);
	fs.appendFile(
		process.env.npm_package_config_errlogfile,
		err.stack + '\n',
		(e) => { if(e) logerr(e) }
	);
});

const server = http.createServer(app);
server.listen(port);
debug( "Listening on port " + port ); 

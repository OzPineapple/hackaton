import express from 'express';
//import crud from './crud/client.js';
import ticket from './ticket.js';
import { getJwt } from '../lib/util.js';
import debuger from 'debug';
import db from '../lib/mongodb.js';
import * as katamari from '../lib/katamari.js';
import cors from 'cors';

const debug = debuger('server:client');

var router = express.Router();

router.use( async (req, res, next) => {
	try{
		const decoded = getJwt( req );
		debug( "usrT:" + decoded.usrT );
		if( decoded.usrT != 2 )
			return res.status(403).send();
		debug("allowed: user" + decoded.id_text +" has the rigth privileges");
		next();
	}catch(e){ switch(e.name){
		case "undefined":
			debug(e.name);
			return res.status(403).send();
		case "NoBearer":
			debug(e.name);
			return res.status(406).send();
		default: next(e);
	}}
});

router.use('/ticket', ticket);

//router.use('/', crud);

router.get('/', async (req, res, next) => {
	try{
		const decoded = getJwt( req );
		var data = await db.getClient( decoded.id_text );
		const privateK = await db.getPrivateKeyOfClient( decoded.id_text );
		debug(typeof privateK);
		data.publicK = await katamari.getPubKey( privateK );
		data.balance = await katamari.getBalance( privateK );
		debug('user asking for own info');
		debug(data);
		res.status(200);
		res.send(data);
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/add/', async (req, res, next) => {
	try{
		const decoded = getJwt( req );
		var data = await db.getClient( decoded.id_text );
		const UsrSK58 = await db.getPrivateKeyOfClient( decoded.id_text );
		katamari.Añadir(2, UsrSK58);
		res.status(202);
		res.send();
	}catch(e){switch(e.name){
		default: next(e);
	}}
});

router.post('/edit', cors(), async (req, res, next) => {
	try{
		debug("User updating own info");
		const decoded = getJwt( req );
		req.body.id_usr = decoded.id_text;
		debug(req.body);
		await db.upClient( req.body );
		res.status(201);
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

export default router;

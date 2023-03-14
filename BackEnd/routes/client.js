import express from 'express';
import crud from './crud/client.js';
import ticket from './ticket.js';
import { getJwt } from '../lib/util.js';
import debuger from 'debug';

const debug = debuger('server:client');

var router = express.Router();

router.use( async (req, res, next) => {
	try{
		const decoded = getJwt( req );
		debug( "usrT:" + decoded.usrT );
		if( decoded.usrT != 2 )
			return res.status(403).send();
		debug("allowed: user has the rigth privileges");
		debug( "id_text: " + decoded.id_text );
		if( decoded.id_text != req.params.id )
			return res.status(403).send();
		debug("allowed: user is accessing to his own information");
		next();
	}catch(e){ switch(e.name){
		case "undefined":
			console.error(e);
			return res.status(403).send();
		case "NoBearer":
			console.error(e);
			return res.status(406).send();
		default: next(e);
	}}
});

router.use('/ticket', ticket);

//router.use('/', crud);

router.get('/', async (req, res) => {
	try{
		const decoded = getJwt( req );
		var data = getClient( decoded.id_text );
		data.publicK = getPubKey( await db.getPrivateKeyOfClient( decoded.id_text ) );
		debug('user asking for own info');
		debug(data);
		res.status(200);
		res.send(data);
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.put('/', async (req, res) => {
	try{
		const decoded = getJwt( req );
		var data = getClient( decoded.id_text );
		UsrSK58 = await db.getPrivateKeyOfClient( decoded.id_text );
		Añadir(2, UsrSK58);
		res.status(202);
		res.send();
	}catch(e){switch(e.name){
		default: next(e);
	}}
});

export default router;

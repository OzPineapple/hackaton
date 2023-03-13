import express from 'express';
import crud from './crud/client.js';
import ticket from './ticket.js';
import { getJwt } from '../lib/util.js';

var router = express.Router();

router.use( async (req, res, next) => {
	try{
		const decoded = getJwt( req );
		debug( "usrT:" + decoded.usrT );
		if( decoded.usrT != 2 )
			return res.status(403).send();
		debug("allowed");
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

router.use('/', crud);
router.use('/ticket', ticket);

export default router;

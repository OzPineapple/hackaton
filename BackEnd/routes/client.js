import express from 'express';
import crud from './crud/client.js';
import ticket from './ticket.js';
import { getJwt } from '../lib/util.js';

var router = express.Router();

router.use( async (req, res, next) => {
	try{
		const decode = await getJwt(req);
		if( req.params.id != decode.id )
			return res.status(403).send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.use('/', crud);
router.use('/ticket', ticket);

export default router;

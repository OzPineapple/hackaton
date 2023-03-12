import express from "express";
import jwt from 'jsonwebtoken';
import admin_router  from   './crud/self.js';
import event_router  from   './crud/event.js';
import guard_router  from   './crud/guard.js';
import organ_router  from   './crud/organ.js';
import client_router from   './crud/client.js';
import { getJwt } from '../lib/util.js';

var router = express.Router();

router.use( async (req, res, next) => {
	debugger;
	try{
		const decode = await getJwt( req );
		if( decoded.user_type != 1 )
			return res.status(403).send();
		next();
	}catch(e){ switch(e.name){
		case "undefined":
			console.error(e);
			return res.status(403).send();
		case "NoBearer":
			console.error(e);
			return res.status(406).send();
	}}
});

router.use('/',       admin_router);
router.use('/event',  event_router);
router.use('/guard',  guard_router);
router.use('/organ',  organ_router);
router.use('/client', client_router);

export default router;

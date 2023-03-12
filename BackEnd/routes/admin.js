import express from "express";
import jwt from 'jsonwebtoken';
import admin_router  from   './crud/self.js';
import event_router  from   './crud/event.js';
import guard_router  from   './crud/guard.js';
import organ_router  from   './crud/organ.js';
import client_router from   './crud/client.js';

var router = express.Router();

router.use( async (req, res, next) => {
	var auth = req.headers['authorization'];
	if( typeof auth == 'undefined' )
		return res.status(403).send();
	auth = auth.split(' ');
	if( auth[0] != 'Bearer' )
		return res.status(406).send();
	try{
		var decoded = await jwt.verify(
			auth[1],
			process.env.npm_package_config_secretKey
		);
		if( decoded.user_type != 'administrator' )
			return res.status(403).send();
		next();
	}catch(e){
		next(e);
	}
});

router.use('/',       admin_router);
router.use('/event',  event_router);
router.use('/guard',  guard_router);
router.use('/organ',  organ_router);
router.use('/client', client_router);

export default router;

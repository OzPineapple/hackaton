import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../lib/mongodb.js';
import * as katamari from '../lib/katamari.js';
import { CustomError, CustomStatusError } from '../lib/error.js';
import debuger from 'debug';

const router = express.Router();
const debug = debuger('server:root');

router.get('/events', async (req, res, next) => {
	try{
		const data = await db.getEvents(); 
		debug('Asking for events, count: '+data.length);
		debug(data);
		res.status(200);
		res.type('json');
		res.send( data );
	}catch(e){
		switch( e.name ){
			case "EmptyQuery":
				res.status(204);
				res.send();
			break;
			default: next(e);
		}
	}
});

router.get('/resells', async (req, res, next) => {
	try{
		res.status(200);
		res.type('json');
		res.send( await db.getResells() );
	}catch(e){
		switch( e.name ){
			case "EmptyQuery":
				res.status(204);
				res.send();
			break;
			default: next(e);
		}
	}
});

router.post('/login', async (req, res, next) => {
	try{
		debug( "request for login" );
		debug( req.body );
		const user_data = await db.login( req.body.name, req.body.password );
		if( ! user_data )
			throw new CustomStatusError( "NullDBQuey", 500,
				"Asked database for user data but " + user_data + " was recived" );
		const token = await jwt.sign( 
			user_data,
			process.env.npm_package_config_secretKey,
			{
				expiresIn: process.env.npm_package_config_jwtttl
			}
		);
		const data = { 
			token: token,
			user_data: user_data
		};
		debug("valid so response:");
		debug(data);
		res.status(200);
		res.type('json');
		res.send(data);
	}catch(e){
		switch( e.name ){
			case "EmptyQuery":
				res.status(404);
				res.send();
			break;
			case "WrongPassword":
				res.status(401);
				res.send();
			break;
			default: next(e);
		}
	}
});

router.post('/new', async (req, res, next) => {
	try{
		req.body.llavep = await katamari.createWallet();
		req.body.usrT = 2;
		debug( "asked for register" );
		debug( req.body );
		await db.newClient( req.body );
		res.status(201);
		res.send();
		debug( "user has been register on teh system" );
	}catch(e){
		switch( e.name ){
			case "DuplicatedQuery":
				res.status(409);
				res.send();
			break;
			default: next(e);
		}
	}
});

router.get('/token', async (req, res) => {
	try{
		debug("User asking for new token");
		const decoded = getJwt( req );
		const token = await jwt.sign( 
			decoded,
			process.env.npm_package_config_secretKey,
			{
				expiresIn: process.env.npm_package_config_jwtttl
			}
		);
		debug( token );
		res.status(201);
		res.send( token );
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

export default router;

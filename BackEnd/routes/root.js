import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../lib/mongodb.js';
import * as katamari from '../lib/katamari.js';
import { CustomError, CustomStatusError } from '../lib/error.js';

const router = express.Router();

router.get('/events', async (req, res, next) => {
	try{
		res.status(200);
		res.type('json');
		res.send( await db.getEvents() );
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
		res.status(200);
		res.type('json');
		res.send({ 
			token: token,
			user_type: user_data.user_type
		});
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
		await db.newUser(
			req.body.name,
			req.body.email,
			req.body.password,
			await katamari.createWallet()
		);
		res.status(201);
		res.send();
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

export default router;

import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../lib/mongodb.js';
import * as katamari from '../lib/katamari.js';

const router = express.Router();

router.get('/events', async (req, res) => {
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
			default: next(err);
		}
	}
});

router.get('/resells', async (req, res) => {
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
			default: next(err);
		}
	}
});

router.post('/login', async (req, res) => {
	try{
		const user_data = await db.login( req.body.name, req.body.password );
		const token = jwt.sign( 
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
			default: next(err);
		}
	}
});

router.post('/new', async (req, res) => {
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
			default: next(err);
		}
	}
});

export default router;

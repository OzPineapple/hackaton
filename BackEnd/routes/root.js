var router = require('express').Router();
const solana = require("../Solana/solana.js");
const db = require('../lib/mongodb.js');
const jwt = require('jsonwebtoken');

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
			default:
				res.status(500);
				res.send();
				console.error(e);
			break;
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
			default:
				res.status(500);
				res.send();
				console.error(e);
			break;
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
			user_type: user_data.type
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
			default:
				res.status(500);
				res.send();
				console.error(e);
			break;
		}
	}
});

module.exports = router;

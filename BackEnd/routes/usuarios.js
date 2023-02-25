var router =  require('express').Router();

const express = require('express');
const db = require('../lib/mongodb.js');

router.post('/login', async (req, res) => {
	try{
		await db.admin_login( req.body );
		req.session.usr = req.body.usr;
		res.status(200).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy();
	res.status(200).send();
});

router.post('/edit', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		await db.update_user( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.post('/new', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		await db.create_user( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

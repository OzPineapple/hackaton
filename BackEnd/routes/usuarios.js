var router =  require('express').Router();

const express = require('express');
const db = require('../lib/mongodb.js');

router.post('/login', (req, res) => {
	if( ! db.user_exists(req.body.user) ){
		res.status(404);
		res.setHeader('Content-Type', 'text/plain');
		res.write("No existe ese usuario");
		res.send();
		return;
	} else if( ! db.user_login( req.body ) ) {
		res.status(401);
		res.setHeader('Content-Type', 'text/plain');
		res.write("Credenciales erroneas");
		res.send();
		return;
	}
	res.status(200);
	res.send();
});

router.delete('delete', (req, res) => {
});

module.exports = router;

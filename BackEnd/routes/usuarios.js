var router =  require('express').Router();

const express = require('express');
const db = require('../lib/mongodb.js');

router.post('/login', async (req, res) => {
	try{
		await db.admin_login( req.body );
		res.status(200).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

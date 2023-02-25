var router =  require('express').Router();

const db = require('../lib/mongodb.js');

const express = require('express');

router.get('/explorar', async (req, res) => {
	try{
		const res = await db.event_getAll();
		console.log( res );
		res.status(200).send( res );
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

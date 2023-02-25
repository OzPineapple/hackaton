var router =  require('express').Router();

const express = require('express');

router.post('/explorar', async (req, res) => {
	try{
		res.write( db.event_getAll() );
		res.status(200).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

var router =  require('express').Router();

const db = require('../lib/mongodb.js');

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
		await db.create_user( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

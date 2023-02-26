var router =  require('express').Router();

const db = require('../lib/mongodb.js');

router.post('/login', async (req, res) => {
	try{
		req.session.usr = await db.admin_login( req.body );
		console.log(req.session.usr);
		res.status(200).send();
		
	}catch(e){
		res.status(e.status).send();
	}
});

router.post('/event', async (req, res) => {
	try{
		req.session.evento = await db.event_getByID( req.body );
		res.status(200).send();
		
	}catch(e){
		res.status(e.status).send();
	}
});

router.get('/event/:id', async (req, res) => {
	try{
		res.status(200).send(await db.event_getByID( req.params.id ));
	}catch(e){
		res.status(e.status).send();
	}
});

router.post('/loginu', async (req, res) => {
	try{
		req.session.usr = await db.usr_login( req.body );
		res.status(200).send();
	}catch(e){
		res.status(e.status).send();
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy();
	res.status(200).send();
});

module.exports = router;

var router =  require('express').Router();

const db = require('../lib/mongodb.js');

router.post('/login', async (req, res) => {
	try{
		await db.admin_login( req.body );
		req.session.usr = req.body.usr;
		res.status(200).send();
	}catch(e){
		res.status(e.status).send();
	}
});

router.post('/loginu', async (req, res) => {
	try{
		await db.usr_login( req.body );
		req.session.usr = req.body.usr;
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

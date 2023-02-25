var router =  require('express').Router();

const db = require('../lib/mongodb.js');

router.get('/explorar', async (req, res) => {
	try{
		res.status(200).send((await db.event_getAll()).toArray());
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

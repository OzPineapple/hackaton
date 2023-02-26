var router =  require('express').Router();

const db = require('../lib/mongodb.js');

router.get('/explorar', async (req, res) => {
	try{
		res.status(200).send(await db.event_getAll());
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.get('/evento/:id', async (req, res) => {
	try{
		res.status(200).send( await db.event_getByID(req.params.id) );
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.post('/evento/:id/buy', async (req, res) => {
	try{
		/* Es aqui donde debe crearse el NFT e introducirlo
		 * a la red de blockchain.
		 * Aunque si el NFT ya esta creado solo debera cambiarse
		 * el dueño actual del NFT
		 */
		var token = "fjifgdshfdsjahj"; // TODO
		res.status(200).send( await db.set_ticket(req.params.id,req.session.usr.id,token) );
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

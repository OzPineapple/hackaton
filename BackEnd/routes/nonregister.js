var router = require('express').Router();
const solana = require("../Solana/solana.js");

const db = require('../lib/mongodb.js');

router.get('/events', async (req, res) => {
	try{
		res.status(200);
		res.type('json');
		res.send( await db.getEvents() );
	}catch(e){
		switch( e.name ){
			case "EmptyQuery":
				res.status(204);
				res.send();
			break;
			default:
				res.status(500);
				res.send();
				console.error(e);
			break;
		}
	}
});

module.exports = router;

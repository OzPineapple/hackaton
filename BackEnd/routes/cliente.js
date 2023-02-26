var router =  require('express').Router();
var genWallet = require('../Solana/WalletGen.js');
var getBalance = require('../Solana/Balance.js');
var { PublicKey } = require("@solana/web3.js");

const db = require('../lib/mongodb.js');

router.get('/', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		req.session.usr.balance = getBalance( new PublicKey( req.session.usr.publicK ) );
		res.status(201).send( req.session.usr );
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.post('/edit', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		await db.user_update( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.post('/new', async (req, res) => {
	try{
		req.body.llavep = "" + await genWallet( req.body );
		console.log( req.body );
		await db.usr_set( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.get('/boletos', async (req, res) => {
	try{
		res.status(201).send( await db.ticket_getByOwner( req.session.usr.id ) );
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

/* Mediante esta ruta se podrá modificar los atributos de un boleto
 * la idea principal es la de modificar si el boleto esta en estado
 * de venta o comprado. Tambíen podría servir para modificar el dueño
 * o aspectos relacionados con los NFT.
 * El body se envia como es recibido desde el front al controlador
 * de mongodb.
 */
router.post('/boleto/edit', async (req, res) => {
	try {
		await db.ticket_update( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

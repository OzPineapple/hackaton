var router =  require('express').Router();
var solana = require("../Solana/solana.js");

const db = require('../lib/mongodb.js');

router.get('/', async (req, res) => {
	try{
		if( ! req.session.usr ) return res.status(401).send();
		req.session.usr.balance = await solana.getBalance( req.session.usr.publicK );
		res.status(201).send( req.session.usr );
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

/*
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
*/

router.post('/addfondos', async (req, res) => {
	try{
		if( ! req.session.usr ) return res.status(401).send();
		let cantidad = Number( req.body );
		if( cantidad > 2 ) return res.status(400).send();
		res.status(201).send( await solana.AddFondos( req.session.usr.publicK, cantidad ) );
	}catch(e){
		console.log(e);
		if( e.name == "SolanaJSONRPCError" )
			return res.status(502).send();
		res.status(500).send();
	}
});

router.post('/new', async (req, res) => {
	try{
		console.log( solana );
		req.body.llavep = "" + await solana.GeneraCuenta( req.body );
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
		if( ! req.session.usr ) return res.status(401).send();
		console.log(req.session.usr.id_text);
		res.status(201).send( await db.ticket_getByOwner( req.session.usr.id_text ) );
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

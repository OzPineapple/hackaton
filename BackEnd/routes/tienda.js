var router =  require('express').Router();
const solana = require("../Solana/solana.js");

const db = require('../lib/mongodb.js');

router.get('/explorar', async (req, res) => {
	try{
		res.status(200).send(await (await db.event_getAll()).toArray());
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.get('/ubi', async (req, res) => {
	try{
		res.status(200).send(await (await db.ubicacion_getAll()).toArray());
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

router.get('/evento/buy', async (req, res) => {
	try{
		/* Es aqui donde debe crearse el NFT e introducirlo
		 * a la red de blockchain.
		 * Aunque si el NFT ya esta creado solo debera cambiarse
		 * el dueño actual del NFT
		 */
		if( ! req.session.usr ) return res.status(401).send();
		var recibo = {};
		// Este nft fue generado por mí, necitamos que el server pueda generar los propios
		var nft_testing = "BHyizx3aXTpDYQv5boaug5nWqVJwbsPQaTbagUPdPoRx";
		recibo.cobro = await solana.comprarBoleto( req.session.publicK, 1 );
		// recibo.nft = await solana.tranferirBoleto( req.session.publicK, nft_testing );
		db.set_ticket(1,req.session.usr.id_text,recibo.cobro);
		console.log( recibo );
		res.status(200).send( recibo );
	}catch(e){
		console.log(e);
		res.status( e.status ? e.status : 500 ).send();
	}
});

module.exports = router;

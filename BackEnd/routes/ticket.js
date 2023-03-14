import express from 'express';
import { getJwt } from '../lib/util.js';
import db from '../lib/mongodb.js';
import * as katamari from '../lib/katamari.js';
//import { getJwt } from '../lib/util.js';
import debuger from 'debug';

const debug = debuger('server:client:ticket');

var router = express.Router();

router.get('/', async (req, res, next) => {
	try{
		const decode = getJwt( req );
		const UsrSK58 = db.getPrivateKeyOfClient( decoded.id_text );
		const data = GetAndFilrtMetadata(UsrPK58);
		debug("Getting NFT of user " + UsrSK58 );
		debug( data );
		res.status(200);
		res.send(data);
	}catch(e){switch(e.name){
		default: next(e);
	}}
});

router.post('/buy', async (req, res, next) => {
	try{
		debug("Ticket is gonna to be buyed");
		const CMaddress = await db.getCMaddressOfEvent( req.body.id );
		debug("Candy machine address: " + CMaddress );
		debug("Metadata for candy machine: ");
		debug( req.body );
		const mint = CreateAndMintNFT(
			req.body.Nombre,
			req.body.Descripcion,
			req.body.imgUri,
			CMaddress,
			req.body.Seccion,
			req.body.Asiento
		);
		debug("Mint of NFT: " + mint );
		const decoded = getJwt(req);
		const UsrSK58 = db.getPrivateKeyOfClient( decoded.id_text );
		debug("Charging user for " + req.charge + " and giving NFT" );
		await CompraYTransfer( req.charge, UsrSK58, minit);
		res.status(201);
		res.send();
	}catch(e){switch(e.name){
		default: next(e);
	}}
});

router.post('/sell', async (req, res, next) => {
	try{
		const decoded = getJwt(req);
		const data = {
			id_seller: decoded.id_text,
			nft: req.body.mint,
			status: 0,
			price: req.body.price
		};
		debug( "user wants to resell" );
		debug( data );
		await db.addResell(data);
		res.status( 200 );
		res.send();
	}catch(e){switch(e.name){
		default: next(e);
	}}
});

export default router;

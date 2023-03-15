import express from 'express';
import { getJwt } from '../lib/util.js';
import db from '../lib/mongodb.js';
import * as katamari from '../lib/katamari.js';
//import { getJwt } from '../lib/util.js';
import debuger from 'debug';
import { CustomError } from '../lib/error.js';

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
		debug(req.body.id);
		const Boleto = JSON.parse(req.body.Boleto);
		debug(Boleto);
		const event = await db.getEvent( parseInt( req.body.id ) );
		debug(event);
		if( ! event ) throw new CustomError("EmptyQuery", event );
		const decoded = getJwt(req);
		const UsrSK58 = await db.getPrivateKeyOfClient( decoded.id_text );
		debug("Charging user for " + event.precio + " and giving NFT" );
		var mints = [];
		debug(typeof UsrSK58)
		debug(typeof event.precio)
		debug(typeof event.CmAddress)
		Boleto.forEach( async boleto => {
			const mint = await katamari.Compra(
				UsrSK58,
				parseInt( event.precio ),
				event.CmAddress
			);
			debug("NFT generated: " + mint);
			await db.set_ticket(
				req.body.id,
				req.body.Boleto.sec,
				req.body.Boleto.asi,
				mint
			)
			mints.push(mint);
		});
		res.status(201);
		res.type('json');
		res.send(mints);
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

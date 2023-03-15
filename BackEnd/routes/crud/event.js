import express from 'express';
import db from '../../lib/mongodb.js';
import * as katamari from '../../lib/katamari.js';
import debuger from 'debug';

const debug = debuger("server:admin:event");

var router = express.Router();

router.get('/', async (req, res, next) => {
	try{
		await db.getEvents( req.body );
		res.status(201);
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/new', async (req, res, next) => {
	try{
		debug("New candy machine for event is begin genrerated");
		debug(req.body)
		const collection = await katamari.CreateACollection (
			req.body.eventName,
			'lib/Solana/NFT/Pruebas/logo.png',
			req.body.desc,
			1000,
			'tm-e',
			req.body.lug
		);
		const event = {
			...req.body,
			_ImgUri: collection[0].ImgUri,
			_MetaDataUrl: collection[0].MetaDataUrl,
			_UriCollection: collection[0].UriCollection,
			_CmAddress: collection[0].CmAddress,
		}
		debug("Nuevo evento a creado en la red de Solana");
		debug( event );
		await db.newEvent( event );
		res.status(202);
		res.send();
		for (let index = 0; index < req.body.lug; index++) {
			var res = await katamari.CreateNFTNoAttributes(
				req.body.eventName,
				collection[0].CmAddress,
				collection[0].MetaDataUrl
			)
			debug("NFT created: ");
			debug(res);
		}
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.get('/one/:id', async (req, res, next) => {
	try{
		res.status(200);
		res.type('json');
		res.send( await db.getEvent( req.params.id ) );
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/delete/one/:id', async (req, res, next) => {
	try{
		await db.rmEvent( req.params.id );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/edit/one/:id', async (req, res, next) => {
	try{
		await db.upEvent( req.body );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

export default router;

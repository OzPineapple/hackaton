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

router.post('/', async (req, res, next) => {
	try{
		debug("New candy machine for event is begin genrerated");
		req.body.candy_machine_address = await CreateACollection (
			req.body.Nombre,
			req.body.LocalUriImg,
			req.body.Descripcion,
			req.body.TarifaReventa,
			req.body.Simbolo
		);
		debug( "Candy machine address: " + req.body.candy_machine_address );
		await db.newEvent( req.body );
		res.status(201);
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.get('/:id', async (req, res, next) => {
	try{
		res.status(200);
		res.type('json');
		res.send( await db.getEvent( req.params.id ) );
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/delete/:id', async (req, res, next) => {
	try{
		await db.rmEvent( req.params.id );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/edit/:id', async (req, res, next) => {
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

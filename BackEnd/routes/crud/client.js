import express from 'express';
import db from '../../lib/mongodb.js';
import debuger from 'debug';

const debug = debuger('server:admin:client');

var router = express.Router();

router.get('/', async (req, res, next) => {
	try{
		const data = await db.getClients();
		debug("Asking for all clients, count: " + data.length);
		res.status(200);
		res.type('json');
		res.send(data);
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/', async (req, res, next) => {
	try{
		await db.newClient( req.body );
		res.status(201);
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.get('/one/:id', async (req, res, next) => {
	try{
		res.status(200);
		res.type('json');
		res.send( await db.getClient( req.params.id ) );
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/delete/one/:id', async (req, res, next) => {
	try{
		await db.rmClient( req.params.id );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/edit/one/:id', async (req, res, next) => {
	try{
		await db.upClient( req.body );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

export default router;

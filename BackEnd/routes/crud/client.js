import express from 'express';
import db from '../../lib/mongodb.js';

var router = express.Router();

router.get('/', async (req, res, next) => {
	try{
		await db.getClients( req.body );
		res.status(201);
		res.send();
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

router.get('/:id', async (req, res, next) => {
	try{
		res.status(200);
		res.type('json');
		res.send( await db.getClient( req.params.id ) );
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.delete('/:id', async (req, res, next) => {
	try{
		await db.rmClient( req.params.id );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.patch('/:id', async (req, res, next) => {
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

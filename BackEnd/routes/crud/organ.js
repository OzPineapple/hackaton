import express from 'express';
import db from '../../lib/mongodb.js';

var router = express.Router();

router.get('/', async (req, res, next) => {
	try{
		await db.getOrgans( req.body );
		res.status(201);
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/', async (req, res, next) => {
	try{
		await db.newOrgan( req.body );
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
		res.send( await db.getOrgan( req.params.id ) );
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/delete/one/:id', async (req, res, next) => {
	try{
		await db.rmOrgan( req.params.id );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

router.post('/edit/one/:id', async (req, res, next) => {
	try{
		await db.upOrgan( req.body );
		res.status(200);
		res.type('json');
		res.send();
	}catch(e){ switch(e.name){
		default: next(e);
	}}
});

export default router;

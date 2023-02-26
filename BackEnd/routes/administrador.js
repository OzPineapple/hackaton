var router =  require('express').Router();
const db = require('../lib/mongodb.js');

const express = require('express');

/* Posterior Implementacion
router.post('/edit', async (req, res) => {
	try{
		await db.update_admin( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});
*/

router.post('/new', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		await db.create_admin( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

/* Las siguietes rutas estan pensadas para funcionar
 * como un CRUD parcial sobre los eventos que serán
 * introducidos por el administrador.
 * Se enviar el req.body directo al controlador
 * de mongodb.
 */
router.post('/evento/new', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		await db.event_set( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.post('/evento/edit', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		await db.create_edit( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

router.post('/evento/delete', async (req, res) => {
	try{
		if( ! req.session.usr )
			res.status(401).send();
		await db.create_delete( req.body );
		res.status(201).send();
	}catch(e){
		console.log(e);
		res.status(e.status).send();
	}
});

module.exports = router;

import express from 'express';
import { getJwt } from '../lib/util.js';
import db from '../lib/mongodb.js';
import * as katamari from '../lib/katamari.js';

var router = express.Router();

router.get('/', async (req, res, next) => {
	const decode = getJwt( req );
});

router.post('/buy', async (req, res, next) => {
});

router.port('/sell', async (req, res, next) => {
});

export default router;

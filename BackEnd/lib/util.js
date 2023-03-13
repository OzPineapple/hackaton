import jwt from 'jsonwebtoken';
import { CustomError } from './error.js';
import debuger from 'debug';

const debug = debuger('server:util:jwt');

export function getJwt(req) {
	debugger;
	var auth = req.headers['authorization'];
	if( typeof auth == 'undefined' )
		throw new CustomError("undefined", "The authorization header is empty" );
	auth = auth.split(' ');
	if( auth[0] != 'Bearer' )
		throw new CustomError("NoBearer", "The scheme for this authorization is wrong");
	debug( auth );
	return jwt.verify(
		auth[1],
		process.env.npm_package_config_secretKey
	);
};

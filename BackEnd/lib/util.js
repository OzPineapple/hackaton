import jwt from 'jsonwebtoken';
import CustomError from './error.js';

export async function getJwt(req) {
	const auth = req.headers['authorization'];
	if( typeof auth == 'undefined' )
		throw new CustomError("Null",null);
	auth = auth.split(' ');
	if( auth[0] != 'Bearer' )
		throw new CustomError("NoBearer",null);
	return decoded = await jwt.verify(
		auth[1],
		process.env.npm_package_config_secretKey
	);
};

const MongoClient = require('mongodb').MongoClient;
const { CustomError } = require('./error');

const uri = process.env.npm_package_config_dburi;

const client	= new MongoClient( uri );
const databse	= client.db( process.env.npm_package_config_dbname );
const collAdmin = databse.collection('Admin');
const collUsuario = databse.collection('Usuario');
const collEvento = databse.collection('Event');
const collTipoEvento = databse.collection('tipoEvento');
const collBoleto = databse.collection('Boleto');
const collUbicacion = databse.collection('Ubicacion');

var driver = {};

driver.admin_get = async userAdmin => {
	console.log( userAdmin );
	const query = { usr: userAdmin };
	const options = {projection: {_id: 0}};

	console.log( query );
	
	const admins = await collAdmin.find(query, options);
	let count = await admins.count();

	if( count == 0 )
		throw new CustomError( "UserNotFound", 404, 
			"El usuario " + userAdmin + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + userAdmin
		);
	else if (count == 1)
		return admins.next();
	else
		throw new CustomError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.admin_login = async ({ usr, pass }) => {
	console.log( usr );
	const admin = await driver.admin_get(usr);
	if( admin.pass != pass )
		throw new CustomError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + usr
		);
}

driver.eventType_getByName = async eventType => {
	const query = { tipoEvento: eventType };
	const options = {projection: {_id: 0}};
	
	const tipo = await collTipoEvento.find(query, options);
	
	return tipo.next();
}

driver.ubicacion_getByName = async ubi =>{
	const query = { ubicacion: ubi };
	const options = {projection: {_id: 0}};
	
	const lugar = await collUbicacion.find(query, options);
	
	return lugar.next();
}

driver.eventType_getByID = async eventType => {
	const query = { id_text: eventType };
	const options = {projection: {_id: 0}};
	
	const tipo = await collTipoEvento.find(query, options);
	
	return tipo.next();
}

driver.ubicacion_getByID = async ubi =>{
	const query = { id_text: ubi };
	const options = {projection: {_id: 0}};
	
	const lugar = await collUbicacion.find(query, options);
	
	return lugar.next();
}

driver.event_set = ({eventName, type, price, date, desc, org, ubi}) =>{

	var size = 0;
	var id_tipo = 0;
	var id_ubi = 0;

	collEvento.countDocuments(function(err,num){
		if(err)
			throw(err)
		else
			size = num;
	})
	size++;

	eventType_get(type, function(err,tipo){
		if (err) 
			throw(err)
		else
			id_tipo = tipo.id_text;
	});

	ubicacion_get(ubi, function(err,ubic){
		if (err) 
			throw(err)
		else
			id_ubi = ubic.id_text;
	});

	var newEvent = {event: eventName, data: desc, managr: org, precio: price, id_text: size, tipoEvento: id_tipo, fecha: date, ubicacion: id_ubi};
	collEvento.insertOne(newEvent, function(err,res){
		if (err)
			throw(err)
		else
			console.log("Documento Insertado");
	})
}

driver.event_getByID = async eventId => {

	const query = { id_text: eventId , fecha:{$gt: newDate().toISOString()} };
	const options = {projection: {_id: 0}};
	
	const evento = await collEvento.findOne(query, options);

	return evento.next();

}

driver.event_getAll = async () => {

	const query = { fecha:{$gt: newDate().toISOString()} };
	const options = {projection: {_id: 0}};
	
	const eventos = await collEvento.find(query, options);

	return eventos;
	
}

driver.usr_set = ({nom, correo, contra, llavep, llavepr}) => {
	var size = 0;

	collUsuario.countDocuments(function(err,num){
		if(err)
			throw(err)
		else
			size = num;
	})
	size++;

	var newUsuario = {id_text: size, mail: correo, pass: contra, name:nom, publicK: llavep, privateK: llavepr};
	collUsuario.insertOne(newUsuario, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Usuario Registrado");
	})
}

driver.usr_getByPrivateK = async priv => {
	const query = { privateK: priv };
	const options = {projection: {_id: 0}};
	
	const users = await collUsuario.find(query, options);
	let count = await users.count();

	if( count == 0 )
		throw new CustomError( "UserNotFound", 404, 
			"El usuario " + user + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + users
		);
	else if (count == 1)
		return users.next();
	else
		throw new CustomError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.usr_getByMail = async corr => {
	const query = { mail: corr };
	const options = {projection: {_id: 0}};
	
	const users = await collUsuario.find(query, options);
	let count = await users.count();

	if( count == 0 )
		throw new CustomError( "UserNotFound", 404, 
			"El usuario " + user + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + users
		);
	else if (count == 1)
		return users.next();
	else
		throw new CustomError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.usr_login = async ({ mail, pass }) => {
	const usr = await driver.usr_getByMail(mail);
	if( usr.pass != pass )
		throw new CustomError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + mail 
		);
}

driver.set_ticket = ({idEvento, idUsr, token}) => {

	var size = 0;

	collBoleto.countDocuments(function(err,num){
		if(err)
			throw(err)
		else
			size = num;
	})
	size++;

	var newBoleto = {id_text: size, evento: idEvento, nft: token, owner: idUsr, fecha: this.event_getByID.fecha};
	collBoleto.insertOne(newBoleto, function(err,res){
		if (err)
			throw(err)
		else
			console.log("Boleto Generado");
	})

}

driver.ticket_getByOwner = async idUsr => {
	const query = { owner: idUSr, fecha:{$gt: newDate().toISOString()} };
	const options = {projection: {_id: 0}};
	
	const bol = await collBoleto.find(query, options);
	
	return bol;
}

module.exports = driver;

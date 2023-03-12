import mongodb from 'mongodb';
import { CustomError, CustomStatusError } from './error.js';

const uri = process.env.npm_package_config_dburi;

const client	= new mongodb.MongoClient( uri );
const databse	= client.db( process.env.npm_package_config_dbname );
const collAdmin = databse.collection('Admin');
const collUsuario = databse.collection('Usuario');
const collEvento = databse.collection('Evento');
const collTipoEvento = databse.collection('tipoEvento');
const collBoleto = databse.collection('Boleto');
const collUbicacion = databse.collection('Ubicacion');

var driver = {};

driver.getResells = () => { throw new CustomError("NoCodedYet", null); }
driver.login = ( name, password ) => { return driver.loginG(name, password);}
driver.getEvents = () => { throw new CustomError("NoCodedYet", null); }
driver.newEvent  = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.upEvent	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.getEvent	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.rmEvent	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getOrgans = () => { throw new CustomError("NoCodedYet", null); }
driver.newOrgan	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.upOrgan	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.getOrgan	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.rmOrgan	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getGuards = () => { throw new CustomError("NoCodedYet", null); }
driver.newGuard	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.upGuard	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.getGuard	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.rmGuard	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getAdmins = () => { throw new CustomError("NoCodedYet", null); }
driver.newAdmin	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.upAdmin	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.getAdmin	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.rmAdmin	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getClients = () => { throw new CustomError("NoCodedYet", null); }
driver.newClient  = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.upClient	  = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.getClient  = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.rmClient	  = ( id ) => { throw new CustomError("NoCodedYet", null); }

//Admin

driver.set_admin = async ({correo, nom, contra, user}) => {

	var size = 0;

	size = await collAdmin.countDocuments();
	size++;

	var newAdmin = {id_text: size, mail: correo, name:nom, pass: contra, usr: user, usrT: "1"};
	await collAdmin.insertOne(newAdmin);
	console.log("Administrador Registrado");

}

driver.admin_get = async userAdmin => {
	const query = { usr: userAdmin };
	const options = {projection: {_id: 0}};
	
	const admins = await collAdmin.find(query, options);
	let count = await admins.count();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + userAdmin + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + userAdmin
		);
	else if (count == 1)
		return admins.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.admin_login = async (userAdmin, pass) => {
	const admin = await driver.admin_get(userAdmin);
	if( admin.pass != pass )
		throw new CustomStatusError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + userAdmin
		);
		
		return admin;
}

//TipoEvento

driver.eventType_getByName = async (eventType) => {
	const query = { tipoEvento: eventType };
	const options = {projection: {_id: 0}};
	
	const tipo = await collTipoEvento.find(query, options);
	
	return tipo.next();
}

driver.eventType_getByID = async (eventTypeID) => {
	const query = { id_text: eventTypeID };
	const options = {projection: {_id: 0}};
	
	const tipo = await collTipoEvento.find(query, options);
	
	return tipo.next();
}


//Ubicacion

driver.ubicacion_getByName = async (ubi) =>{
	const query = { ubicacion: ubi };
	const options = {projection: {_id: 0}};
	
	const lugar = await collUbicacion.find(query, options);
	
	return lugar.next();
}

driver.ubicacion_getByID = async (ubID) =>{
	const query = { id_text: ubID };
	const options = {projection: {_id: 0}};
	
	const lugar = await collUbicacion.find(query, options);
	
	return lugar.next();
}

driver.ubicacion_getAll = () => {

	const query = {};
	const options = {projection: {_id: 0}};

	const ubicaciones = collUbicacion.find(query, options);
	
	return ubicaciones;

}

//Eventos

driver.event_set = async ({eventName, tipoE, price, date, desc, org, ubi, lug, dispo, candy, imgURL, folioD}) =>{

	var size = 0;
	var size = 0;

	size = await collUsuario.countDocuments();
	size++;

	

	var newEvent = {event: eventName, data: desc, managr: org, precio: price, id_text: size, type: tipoE, fecha: date, ubicacion: ubi, lugares: lug, lugaresDisp:dispo, cMach:candy, imgU: imgURL, docF: folioD};
	collEvento.insertOne(newEvent, function(err,res){
		if (err)
			throw(err)
		else
			console.log("Documento Insertado");
	})
}

driver.event_getByID = async eventId => {

	const query = { id_text:  eventId  };
	const options = {projection: {_id: 0}};
	
	const evento =  collEvento.find(query, options);
	const array = await evento.toArray();

	return array;

}

driver.event_getAll = async () => {

	const query = {fecha:{ $gte : new Date().toISOString() }, lugaresDisp:{ $gt : 0 }};

	const options = {projection: {_id: 0}};


	const eventos = collEvento.find(query, options);
	
	return eventos;
	
}

driver.event_update = ({id_eve, prec, fech}) => {

	db.collEvento.updateOne({id_text: id_eve}, { precio: prec, fecha: fech}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Evento Actualizado");
	});

}

//Usuarios

driver.usr_set = async ({nom, correo, contra, llavep}) => {
	var size = 0;

	size = await collUsuario.countDocuments();
	size++;

	var newUsuario = {id_text: size, mail: correo, pass: contra, name:nom, publicK: llavep, usrT: "2"};
	await collUsuario.insertOne(newUsuario);
	console.log("Usuario Registrado");
}

driver.usr_getByPublicK = async pubK => {
	const query = { publicK: pubK };
	const options = {projection: {_id: 0}};
	
	const users = await collUsuario.find(query, options);
	let count = await users.count();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + user + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demasiados usuarios duplicados, deberían ser únicos para la busqueda " + users
		);
	else if (count == 1)
		return users.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.usr_getByMail = async (correo) => {
	const query = { mail: correo };
	const options = {projection: {_id: 0}};
	
	const users = await collUsuario.find(query, options);
	let count = await users.count();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El correo " + correo + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demasiados usuarios duplicados, deberían ser únicos para la busqueda " + correo
		);
	else if (count == 1)
		return users.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.usr_getByID = async id_usr => {
	const query = { id_text: id_usr };
	const options = {projection: {_id: 0}};
	
	const users = await collUsuario.find(query, options);
	let count = await users.count();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + corr + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + corr
		);
	else if (count == 1)
		return users.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.usr_login = async (correo, pass) => {
	const usr = await driver.usr_getByMail(correo);
	if( usr.pass != pass )
		throw new CustomStatusError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + correo 
		);
		console.log(usr);
		return usr;
}

driver.usr_update = ({id_usr, nom, correo, contra}) => {

	db.collUsuario.updateOne({id_text: id_usr}, {mail: correo, name: nom, pass: contra}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Usuario Actualizado");
	});

}

//Boletos

driver.set_ticket = (idEvento, idUsr, token) => {

	var size = 0;

	collBoleto.countDocuments(function(err,num){
		if(err)
			throw(err)
		else
			size = num;
	})
	size++;

	var newBoleto = {id_text: size, evento: idEvento, nft: token, owner: idUsr, fecha: this.event_getByID.fecha};
	collBoleto.insertOne(newBoleto, async function(err,res){

		var nDisp = await event_getByID(idEvento).lugaresDisp

		if (err)
			throw(err)
		else
			db.collEvento.updateOne({id_text: idEvento},{lugaresDisp: nDisp});
			console.log("Boleto Generado");
	})

}

driver.ticket_getByOwner = async idUsr => {
	const query = { owner: "" + idUsr, fecha:{$gt: new Date().toISOString()} };
	//const query = { owner: "" + idUsr };
	const options = {projection: {_id: 0}};
	
	const bol = collBoleto.find(query, options);
	console.log( await collBoleto.countDocuments());
	console.log( await collBoleto.find().toArray());
	const arry = await bol.toArray();
	console.log(  arry );
	return arry;
}

driver.ticket_update = (id_tick, id_own) => {

	db.collBoleto.updateOne({id_text: id_tick}, {owner: id_own}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Boleto Actualizado, Nuevo Dueño Asignado");
	});

}

//Login General

driver.loginG = async (data, pass) => {

	var usu, admin;

	try{
		usu = await driver.usr_login(data, pass);
		console.log(usu);
	} catch (e){
		console.log(e);
	}

	try{
		admin = await driver.admin_login(data, pass);
		console.log(admin);
	}catch (e){
		console.log(e);
	}

	if (usu!=undefined && admin!=undefined){
		throw new CustomStatusError( "DuplicatedRecord", 409,
			"Demasiados usuarios duplicados, deberían ser únicos para la busqueda " + data
		);
	}else if(usu!=undefined){
		return usu;
	}else if(admin!=undefined){
		return admin;
	}
	else
		throw new CustomStatusError( "SomethingWentWrong", 500,
			"La chingadera hace cosas raras, buggaso con:" + data);

}

export default driver;

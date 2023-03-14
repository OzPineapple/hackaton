import mongodb from 'mongodb';
import { CustomError, CustomStatusError } from './error.js';
import debuger from 'debug';

const debug = debuger("server:mongodb");

const uri = process.env.npm_package_config_dburi;

const client	= new mongodb.MongoClient( uri );
const databse	= client.db( process.env.npm_package_config_dbname );
const collAdmin = databse.collection('Admin');
const collUsuario = databse.collection('Usuario');
const collEvento = databse.collection('Evento');
const collTipoEvento = databse.collection('tipoEvento');
const collBoleto = databse.collection('Boleto');
const collUbicacion = databse.collection('Ubicacion');
const collOrganizador = databse.collection('Organizador');
const collGuardia = databse.collection('Guardia');
const collSeguimiento = databse.collection('Seguimiento');
const collSolicitudA = databse.collection('SolicitudA');
const collSolicitudB = databse.collection('SolicitudB');
const collSolicitudC = databse.collection('SolicitudC');
const collReVenta = databse.collection('reVenta');
const collCompra = databse.collection('Compra');
const collReCompra = databse.collection('reCompra')

var driver = {};

driver.getResells = () => { throw new CustomError("NoCodedYet", null); }
driver.login = ( name, password ) => { return driver.loginG(name, password); }
driver.getEvents = () => { return driver.event_getAll(); }
driver.newEvent  = ( reqBody ) => { return driver.event_set(reqBody); }
driver.upEvent	 = ( reqBody ) => { return driver.event_update(reqBody); }
driver.getEvent	 = ( id ) => { return driver.event_getByID(id); }
// driver.rmEvent	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getOrgans = () => { return driver.org_getAll(); }
driver.newOrgan	 = ( reqBody ) => { return driver.set_org(reqBody); }
// driver.upOrgan	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.getOrgan	 = ( id ) => { return driver.org_getByID(id); }
// driver.rmOrgan	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getGuards = () => { return driver.grd_getAll(); }
driver.newGuard	 = ( reqBody ) => { return driver.set_grd(reqBody); }
// driver.upGuard	 = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }
driver.getGuard	 = ( id ) => { return driver.grd_getByID(id) }
// driver.rmGuard	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getAdmins = () => { return driver.admin_getAll(); }
driver.newAdmin	 = ( reqBody ) => { return driver.admin_get(reqBody); }
driver.upAdmin	 = ( reqBody ) => { return driver.admin_update(reqBody); }
driver.getAdmin	 = ( id ) => { return driver.admin_getByID(id); }
// driver.rmAdmin	 = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getClients = () => { return driver.usr_getAll(); }
driver.newClient  = ( reqBody ) => { return driver.usr_set(reqBody); }
driver.upClient	  = ( reqBody ) => { return driver.usr_update(reqBody); }
driver.getClient  = ( id ) => { return driver.usr_getByID(id); }
// driver.rmClient	  = ( id ) => { throw new CustomError("NoCodedYet", null); }
driver.getPrivateKeyOfClient = ( id ) => { return driver.usr_getPrivKByID(id); }
driver.getCMaddressOfEvent = ( id ) => { return driver.event_getCM(id); }
driver.addResell = ( reqBody ) => { throw new CustomError("NoCodedYet", null); }

//Admin

driver.set_admin = async ({correo, nom, contra, user}) => {

	var size = 0;

	size = await collAdmin.countDocuments();
	size++;

	var newAdmin = {id_text: size, mail: correo, name:nom, pass: contra, usr: user, usrT: "1"};
	await collAdmin.insertOne(newAdmin);
	console.log("Administrador Registrado");

}

driver.admin_getByUsr = async (userAdmin) => {
	const query = { usr: userAdmin };
	const options = {_id: 0};
	
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

driver.admin_getByID = async (idAdmin) => {
	const query = { id_text: idAdmin };
	const options = {_id: 0, pass: 0};
	
	const admins = await collAdmin.find(query, options);
	let count = await admins.count();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + idAdmin + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + idAdmin 
		);
	else if (count == 1)
		return admins.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.admin_getAll = async () => {

	const query = {};

	const options = {_id: 0, pass:0};

	const admins = collAdmin.find(query, options);
	
	return admins;
	
}

driver.admin_login = async (userAdmin, pass) => {
	const admin = await driver.admin_getByUsr(userAdmin);
	if( admin.pass != pass )
		throw new CustomStatusError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + userAdmin
		);
	else
		return admin;
}

driver.admin_update = ({id_usr, correo, nom, contra, usu}) => {

	db.collUsuario.updateOne({id_text: id_usr}, {mail: correo, name: nom, pass: contra, usr:usu}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Usuario Actualizado");
			return res;
	});

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

driver.event_getCM = async (eventId) => {
	const evnt = driver.event_getByID(eventId);

	return evnt.cMach;
}

driver.event_update = ({id_eve, prec, fech}) => {

	db.collEvento.updateOne({id_text: id_eve}, { precio: prec, fecha: fech}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Evento Actualizado");
			return res;
	});

}

//Usuarios

driver.usr_set = async ({nom, correo, contra, llavep}) => {
	var size = 0;

	size = await collUsuario.countDocuments();
	size++;

	var newUsuario = {id_text: size, mail: correo, pass: contra, name:nom, privateK: llavep, usrT: "2"};
	
	await collUsuario.insertOne(newUsuario);
	console.log("Usuario Registrado");
}

driver.usr_getByPrivateK = async privK => {
	const query = { privateK: privK };
	const options = {_id: 0};
	
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
	const options = {_id: 0};
	
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

driver.usr_getByID = async (id_usr) => {
	const query = { id_text: id_usr };
	const options = {_id: 0};
	
	const users = await collUsuario.find(query, options);
	let count = await users.count();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + id_usr + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + id_usr
		);
	else if (count == 1)
		return users.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.usr_getPrivKByID = async ( idUsr ) => {
	const query = { id_text: idUsr };
	const options = {_id: 0, privateK: 1};
	
	const users = await collUsuario.find(query, options);
	let count = await users.count();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + idUsr + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demasiados usuarios duplicados, deberían ser únicos para la busqueda " + idUsr
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
	else
		return usr;
}

/* driver.usr_update = ({id_usr, nom, correo, contra}) => {

	db.collUsuario.updateOne({id_text: id_usr}, {mail: correo, name: nom, pass: contra}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Usuario Actualizado");
			return res;
	});

} */

driver.usr_getAll = async () => {

	const query = {};

	const options = {_id: 0, pass:0};

	const usrs = collUsuario.find(query, options);
	
	return usrs;
	
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

	var newBoleto = {id_text: size, evento: idEvento, nft: token, owner: idUsr, fechaE: driver.event_getByID(idEvento).fecha};
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

//Organizador

driver.set_org = async ({nom, correo, contra, wallt, clab, rf}) => {

	var size = 0;

	size = await collOrganizador.countDocuments();
	size++;

	var newOrg = {id_text: size, name:nom, mail: correo, pass: contra, wallet: wallt, CLABE: clab, rfc: rf, usrT: "3"};
	await collOrganizador.insertOne(newOrg);
	console.log("Administrador Registrado");

}

driver.org_getByMail = async (mailOrg) => {
	const query = { mail: mailOrg };
	const options = {_id: 0};
	
	const orgs = await collOrganizador.find(query, options);
	let count = await orgs.countDocuments();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + mailOrg + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + mailOrg
		);
	else if (count == 1)
		return orgs.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.org_getByID = async (idOrg) => {
	const query = { id_text: idOrg };
	const options = {_id: 0, pass: 0};
	
	const orgs = await collOrganizador.find(query, options);
	let count = await orgs.countDocuments();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + idOrg + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + idOrg 
		);
	else if (count == 1)
		return orgs.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.org_getAll = async () => {

	const query = {};

	const options = {_id: 0, pass:0};

	const orgs = collOrganizador.find(query, options);
	
	return orgs;
	
}

driver.org_login = async (mailOrg, pass) => {
	const org = await driver.org_get(mailOrg);
	if( org.pass != pass )
		throw new CustomStatusError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + mailOrg
		);
	else
		return org;
}

/*driver.org_update = ({id_usr, correo, nom, contra, usu}) => {

	db.collOrganizador.updateOne({id_text: id_usr}, {mail: correo, name: nom, pass: contra, usr:usu}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Usuario Actualizado");
			return res;
	});

}*/

//Guardia

driver.set_grd = async ({nom, correo, contra, eventId}) => {

	var size = 0;

	size = await collGuardia.countDocuments();
	size++;

	var newGrd = {id_text: size, name:nom, mail: correo, pass: contra, event: eventId, usrT: "4"};
	await collGuardia.insertOne(newGrd);
	console.log("Guardia Registrado");

}

driver.grd_getByMail = async (mailGrd) => {
	const query = { mail: mailGrd };
	const options = {_id: 0};
	
	const grds = await collGuardia.find(query, options);
	let count = await grds.countDocuments();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + mailGrd + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + mailGrd
		);
	else if (count == 1)
		return grds.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.grd_getByID = async (idGrd) => {
	const query = { id_text: idGrd };
	const options = {_id: 0, pass: 0};
	
	const grds = await collGuardia.find(query, options);
	let count = await grds.countDocuments();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"El usuario " + idGrd + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + idGrd 
		);
	else if (count == 1)
		return grds.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.grd_getAll = async () => {

	const query = {};

	const options = {_id: 0, pass:0};

	const grds = collGuardia.find(query, options);
	
	return grds;
	
}

driver.grd_login = async (mailGrd, pass) => {
	const grd = await driver.org_get(mailGrd);
	if( grd.pass != pass )
		throw new CustomStatusError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + mailGrd
		);
	else
		return grd;
}

/*driver.grd_update = ({id_usr, correo, nom, contra, usu}) => {

	db.collGuardia.updateOne({id_text: id_usr}, {mail: correo, name: nom, pass: contra, usr:usu}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Usuario Actualizado");
			return res;
	});

}*/

//Login General

driver.loginG = async (data, pass) => {

	var usu, admin, org, grd;

	try{
		grd = await driver.grd_login(data, pass);
		debug(grd);
	}catch (e){
		console.log(e);
	}

	try{
		org = await driver.org_login(data, pass);
		debug(org);
	}catch (e){
		console.log(e);
	}

	try{
		usu = await driver.usr_login(data, pass);
		debug(usu);
	} catch (e){
		console.log(e);
	}

	try{
		admin = await driver.admin_login(data, pass);
		debug(admin);
	}catch (e){
		console.log(e);
	}

	if (admin!=undefined && usu==undefined && org==undefined && grd==undefined){
		return admin;
	}else if(usu!=undefined && admin==undefined && org==undefined && grd==undefined){
		return usu;
	}else if(org!=undefined && admin==undefined && usu==undefined && grd==undefined){
		return org;
	}else if(grd!=undefined && admin==undefined && usu==undefined && org==undefined){
		return grd;
	}
	else{
		throw new CustomStatusError( "SomethingWentWrong", 404,
			"No hay registros con:" + data);
	}

}

//Solicitudes Alta

driver.set_solA = async ({org, evento}) => {

	var size = 0;

	size = await collSolicitudA.countDocuments();
	size++;

	var newSolA = {id_text: size, managr: org, event: evento, status: "1"};
	await collSolicitudA.insertOne(newSolA);
	console.log("Solicitud de Alta Registrada");

}

driver.solA_getByID = async (idSolA) => {
	const query = { id_text: idSolA };
	const options = {_id: 0};
	
	const solsA = await collSolicitudA.find(query, options);
	let count = await solsA.countDocuments();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"La Solicitud " + idSolA + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Solicitudes duplicadas, deberían ser únicas para la busqueda " + idSolA
		);
	else if (count == 1)
		return solsA.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.solA_getAll = async () => {

	const query = {};

	const options = {_id: 0};

	const solsA = collSolicitudA.find(query, options);
	
	return solsA;
	
}

driver.solA_update = ({id_solA, stat}) => {

	db.collSolicitudA.updateOne({id_text: id_solA}, {status: stat}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Solicitud Actualizada");
			return res;
	});

}

//Solicitudes Baja

driver.set_solB = async ({org, eventID, docURL, raz}) => {

	var size = 0;

	size = await collSolicitudB.countDocuments();
	size++;

	var newSolB = {id_text: size, managr: org, event: eventID, docSol: docURL, status: "1", razones: raz};
	await collSolicitudB.insertOne(newSolB);
	console.log("Solicitud de Baja Registrada");

}

driver.solB_getByID = async (idSolB) => {
	const query = { id_text: idSolB };
	const options = {_id: 0};
	
	const solsB = await collSolicitudB.find(query, options);
	let count = await solsB.countDocuments();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"La Solicitud " + idSolB + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Solicitudes duplicadas, deberían ser únicas para la busqueda " + idSolB
		);
	else if (count == 1)
		return solsB.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.solB_getAll = async () => {

	const query = {};

	const options = {_id: 0};

	const solsB = collSolicitudB.find(query, options);
	
	return solsB;
	
}

driver.solB_update = ({id_solB, stat}) => {

	db.collSolicitudB.updateOne({id_text: id_solB}, {status: stat}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Solicitud Actualizada");
			return res;
	});

}

//Solicitudes Cambio

driver.set_solC = async ({org, eventID, docURL, raz}) => {

	var size = 0;

	size = await collSolicitudC.countDocuments();
	size++;

	var newSolC = {id_text: size, managr: org, event: eventID, docSol: docURL, status: "1", razones: raz};
	await collSolicitudC.insertOne(newSolC);
	console.log("Solicitud de Cambio Registrada");

}

driver.solC_getByID = async (idSolC) => {
	const query = { id_text: idSolC };
	const options = {_id: 0};
	
	const solsC = await collSolicitudC.find(query, options);
	let count = await solsC.countDocuments();

	if( count == 0 )
		throw new CustomStatusError( "UserNotFound", 404, 
			"La Solicitud " + idSolC + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomStatusError( "Duplicated Record", 409,
			"Solicitudes duplicadas, deberían ser únicas para la busqueda " + idSolC
		);
	else if (count == 1)
		return solsC.next();
	else
		throw new CustomStatusError( "UnknownError", 500,
			"Un error desconocido evita que el servidor pueda procesar la peticion"
		);
}

driver.solC_getAll = async () => {

	const query = {};

	const options = {_id: 0};

	const solsC = collSolicitudC.find(query, options);
	
	return solsC;
	
}

driver.solC_update = ({id_solB, stat}) => {

	db.collSolicitudC.updateOne({id_text: id_solB}, {status: stat}, function(err, res){
		if (err)
			throw(err)
		else
			console.log("Solicitud Actualizada");
			return res;
	});

}

//Seguimientos

driver.set_Seg = async (tipoS, admi, dat, idSol, desc) => {

	var size = 0;

	size = await collSeguimiento.countDocuments();
	size++;

	var newSeg = {id_text: size, tipoSol: tipoS, admin: admi, fecha: dat, solicitud: idSol, descripcion: desc};
	await collSolicitudC.insertOne(newSeg);
	console.log("Seguimiento Registrado");

}

// Compras

driver.set_compra = async ({buyID, bolID, dateC}) => {

	var size = 0;

	size = await collCompra.countDocuments();
	size++;

	var newCom = {id_text: size, buyer: buyID, ticket: bolID, sellStatus: "1", fechaC: dateC};
	await collCompra.insertOne(newCom);
	console.log("Compra Registrada");

}

// Reventas

driver.set_reSell = async ({sellerID, bolID, precio}) => {

	var size = 0;

	size = await collReVenta.countDocuments();
	size++;

	var newReS = {id_text: size, seller: sellerID, ticket: bolID, sellStatus: "1", price: precio};
	await collReVenta.insertOne(newReS);
	console.log("Reventa Registrada");

}

// ReCompra

driver.set_reCom = async ({buyID, reSellID, dateC}) => {

	var size = 0;

	size = await collReCompra.countDocuments();
	size++;

	var newReC = {id_text: size, buyer: buyID, sell: reSellID, fechaC: dateC};
	await collReCompra.insertOne(newReC);
	console.log("Compra de Reventa Registrada");

}

export default driver;

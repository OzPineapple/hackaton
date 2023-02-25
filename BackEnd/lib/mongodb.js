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
	const query = { usr: userAdmin };
	const options = {projection: {_id: 0}};
	
	const admins = await collAdmin.find(query, options);
	let count = await admins.count();

	if( count == 0 )
		throw new CustomError( "UserNotFound", 404, 
			"El usuario " + userAdmin + " no se encuentra en la base de datos " + process.env.npm_package_config_dbname
		);
	else if( count > 1 )
		throw new CustomError( "InvalidDuplicate", 500,
			"Demaciados usuarios duplicados, deberían ser únicos para la busqueda " + userAdmin
		);
	return admins.next();
}

driver.admin_login = async ({ usr, pass }) => {
	const admin = await driver.admin_get(usr);
	if( admin.pass != pass )
		throw new CustomError( "WrongPassword", 401,
			"La contraseña no es correcta para el usuario " + usr 
		);
}

driver.eventType_get = async eventType => {
	const query = { tipoEvento: eventType };
	const options = {projection: {_id: 0}};
	
	const tipo = await collTipoEvento.find(query, options);
	
	return tipo;
}

driver.event_set = ({eventName, type, price, date, desc, org}) =>{
	var size = 0;
	var id_tipo = 0;
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
			id_tipo = tipo.tipoEvento;
	});
	var newEvent = {event: eventName, data: desc, managr: org, precio: price, id_text: size, tipoEvento: id_tipo, fecha: date};
	collEvento.insertOne(newEvent, function(err,res){
		if (err)
			throw(err)
		else
			console.log("Documento Insertado")
	})
}

module.exports = driver;

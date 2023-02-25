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
	
	const admin = await collAdmin.find(query, options);
	if (admin.exists())
		return admin;
	else
		return null;
}

driver.admin_login = ({ usr, pass }) => {
	var val = false;

	this.admin_get(usr, function(err, result){
		if (err) throw (err);
		if (pass == result.pass) val=true;
	});
	
	return val;
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

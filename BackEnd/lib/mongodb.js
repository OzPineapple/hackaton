const MongoClient = require('mongodb').MongoClient;

/* TODO: Hay que hacer la uri para conectarse a mongodb */
const uri = process.env.npm_package_config_dburi;

const client	= new MongoClient( uri );
const databse	= client.db( process.env.npm_package_config_dbname );

var driver = {};

driver.user_exists = user => {
	return true;
}

driver.user_login = ({ root, root }) => {
	return true;
}

driver.user_update_name = ({ root, update }) => {
	return true;
}

driver.user_update_pass = ({ root, update }) => {
	return true;
}

module.exports = driver;

const MongoClient = requiere('mongodb').MongoClient;

/* TODO: Hay que hacer la uri para conectarse a mongodb */
const uri = "";

const client	= new MongoClient( uri );
const databse	= client.db( process.env.npm_package_config_dbname );

var driver = {};

driver.user_exists = user => {
	return true;
}

driver.user_login = { user, pass } => {
	return true;
}

driver.user_update_name = { user, update } =>
	return true;
}

driver.user_update_pass = { user, update } =>
	return true;
}

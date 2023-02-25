class CustomError extends Error {
	constructor( name, status, message ){
		super( message );
		this.status = status;
		this.name = name;
	}
}

module.exports = {
	CustomError
}

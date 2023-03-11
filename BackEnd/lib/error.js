class CustomStatusError extends Error {
	constructor( name, status, message ){
		super( message );
		this.status = status;
		this.name = name;
	}
}

class CustomError extends Error {
	constructor( name, message ){
		super( message );
		this.name = name;
	}
}

module.exports = {
	CustomStatusError,
	CustomError
}

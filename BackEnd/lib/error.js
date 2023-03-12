export class CustomStatusError extends Error {
	constructor( name, status, message ){
		super( message );
		this.status = status;
		this.name = name;
	}
}

export class CustomError extends Error {
	constructor( name, message ){
		super( message );
		this.name = name;
	}
}

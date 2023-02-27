const solana = require("./solana.js");

async function main() {
	/*
	const pk = await solana.GeneraCuenta();
	console.log( await solana.AddFondos( pk, 2 ) );
	console.log( await solana.getBalance( pk ) );
	*/
	let testpk = "35XzqbB5gxuXhqXWKRa9jThXexf2zwAS8r8ZT2b4ZHeGcUjJffyr7e1Lws4DvFVKao6D2BiE2aeHzNS9yhF7SkMy"
	await solana.comprarBoleto( testpk, 1 );
	await solana.transferirBoleto( testpk, "BHyizx3aXTpDYQv5boaug5nWqVJwbsPQaTbagUPdPoRx" );
}

main();

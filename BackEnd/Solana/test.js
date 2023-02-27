const solana = require("./solana.js");

async function main() {
	const pk = await solana.GeneraCuenta();
	console.log( await solana.AddFondos( pk, 2 ) );
	console.log( await solana.getBalance( pk ) );
}

main();

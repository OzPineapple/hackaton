const solana = require("./solana.js");

async function main() {
	const pk = await solana.GeneraCuenta();
	console.log( await solana.AddFondos( pk ) );
}

main();

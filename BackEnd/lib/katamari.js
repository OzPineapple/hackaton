import { CreateWall, Balance } from './Solana/Wallet.js';

export {
	CreateWall as createWallet,
	Balance as getBalance
}

async function main() {
	console.log( await CreateWall() );
}

main();

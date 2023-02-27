const tsimport = require("ts-import");
solana = {};

solana.GeneraCuenta = tsimport.loadSync("WalletGen.ts").GeneraCuenta;
solana.AddFondos = tsimport.loadSync("PaySimulado/AñadirFondos.ts").AddFondos;

module.exports = solana

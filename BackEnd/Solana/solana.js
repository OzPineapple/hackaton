const tsimport = require("ts-import");
solana = {};

solana.GeneraCuenta = tsimport.loadSync("./Solana/WalletGen.ts").GeneraCuenta;
solana.AddFondos = tsimport.loadSync("./Solana/PaySimulado/AñadirFondos.ts").AddFondos;

module.exports = solana

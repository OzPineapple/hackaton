module.exports = {
	GeneraCuenta : require("./WalletGen"),
	AddFondos : require("./PaySimulado/AñadirFondos"),
	getBalance : require("./Balance.js"),
	comprarBoleto : require("./PaySimulado/Transaccion.js"),
	transferirBoleto : require("./NFT/Transfer.js")
}

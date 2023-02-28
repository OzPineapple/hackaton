module.exports = {
	GeneraCuenta : require("./WalletGen"),
	AddFondos : require("./PaySimulado/AñadirFondos"),
	getBalance : require("./Balance.js").getBalance,
	getPubkey : require("./Balance.js").getPubkey,
	comprarBoleto : require("./PaySimulado/Transaccion.js"),
	transferirBoleto : require("./NFT/Transfer.js")
}

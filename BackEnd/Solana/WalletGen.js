const { Keypair, PublicKey, SystemProgram } = require("@solana/web3.js");

/* Esta función genera llaves publicas basandose en la
 * información de usuario. Se usa como parametro
 * un objeto de la colleción de usuarios tipo
 * clientes.
 */
module.exports = async ( { correo, nom } ) => {
	let basePubkey = new PublicKey("3s7nubyZjqv4cEtPjzGiVahXThYCS8PSw4DNG9ApqAp3");
	let seed = correo + nom;
	let programId = SystemProgram.programId;
	return await PublicKey.createWithSeed(basePubKey, seed, programId );
}

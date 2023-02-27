const  { clusterApiUrl, Connection, Keypair, PublicKey}  = require( "@solana/web3.js");
const  bs58  = require( "bs58");

module.exports = async (usrSk58) => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const usrSk58aux = bs58.decode(usrSk58);
    const usrKeypair=  Keypair.fromSecretKey(usrSk58aux);
    const UsrPk = usrKeypair.publicKey
	console.log( UsrPk );
    return connection.getBalance(UsrPk);
}

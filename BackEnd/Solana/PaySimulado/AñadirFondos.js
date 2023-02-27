const { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } = require( "@solana/web3.js");
const bs58 = require( "bs58");
const web3 = require ('@solana/web3.js')
const connection = new Connection(clusterApiUrl('devnet'));

module.exports = async (usrSk58,n) => {

    const usrSk58aux = bs58.decode(usrSk58);
    const usrKeypair=  Keypair.fromSecretKey(usrSk58aux);
    const UsrPk = usrKeypair.publicKey
    var SOl = web3.LAMPORTS_PER_SOL*n
    const airdropSignature = await connection.requestAirdrop(UsrPk,SOl);
    return airdropSignature;
}

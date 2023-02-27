const  { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction }  = require( "@solana/web3.js");
const  bs58  = require( "bs58");
const connection = new Connection(clusterApiUrl('devnet'));
const  fs  = require( "fs");

module.exports = async function CompraBoleto(usrSk58, n) {
    //Llaves del servidor
    const wallet = JSON.parse(fs.readFileSync( process.env.HOME + "/.config/solana/id.json" , "utf-8"))
    const secretKey =Uint8Array.from(wallet);
    const keypair =Keypair.fromSecretKey(secretKey);
    const ServerPk = keypair.publicKey;

    //Llaves del usuarío
    
    const usrSk58aux = bs58.decode(usrSk58);
    const usrKeypair=  Keypair.fromSecretKey(usrSk58aux);
    const UsrPk = usrKeypair.publicKey

    //Sender y reciper
    const sender =  UsrPk;
    const recipient  = ServerPk;

    //Transaccion
    const transaction = new Transaction();
    const Pago = SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: LAMPORTS_PER_SOL*n
    })
    transaction.add(Pago);

    console.log("here");

    //Firma de validación

    //No esta validado, creo que por que el firmante debe de ser el usuario
    const signature = sendAndConfirmTransaction(
        connection,
        transaction,
        [usrKeypair]
    );

    //Retorno de Firma
    return signature;
}

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
const web3 = require ('@solana/web3.js')
const connection = new Connection(clusterApiUrl('devnet'));
import fs from "fs";

async function CompraBoleto(usrSk58 : string) {
    //Llaves del servidor
    const wallet = JSON.parse(fs.readFileSync("$HOME/.config/solana/id.json"
, "utf-8"))
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
        lamports: LAMPORTS_PER_SOL * .1
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


console.log(CompraBoleto("gDQC6nFojPdH1cDQS2TXQNZGRQXvtkEKkERetPcd8TA"));

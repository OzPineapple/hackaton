import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
const web3 = require ('@solana/web3.js')
const connection = new Connection(clusterApiUrl('devnet'));
import fs from "fs";

async function CompraBoleto(UsrPk) {
    //Llaves del servidor
    const wallet = JSON.parse(fs.readFileSync("/Users/haru/.config/solana/id.json", "utf-8"))
    const secretKey =Uint8Array.from(wallet);
    const keypair =Keypair.fromSecretKey(secretKey);
    const ServerPk = keypair.publicKey;

    //Llaves del usuarío
    const UserPk = new PublicKey(UsrPk);

    //Sender y reciper
    const sender =  UserPk;
    const recipient  = ServerPk;

    //Transaccion
    const transaction = new Transaction();
    const Pago = SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: LAMPORTS_PER_SOL * .1
    })
    transaction.add(Pago);

    //Firma de validación
    const signature = sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
    );

    //Retorno de Firma
    return signature;
}



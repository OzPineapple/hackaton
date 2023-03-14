import { Keypair, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import fs from "fs";
import { type } from "os";
import { Conn, Decode, Solecitos } from "../Util.js";

export async function CompraBoleto(UsrSK58, n) {
    //Llaves del servidor a este punto ya deberías saber que estoy haciendo
    const ServerW = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8"));
    const ServerSK = Uint8Array.from(ServerW);
    const ServerKeypair = Keypair.fromSecretKey(ServerSK);
    const ServerPK = ServerKeypair.publicKey;

    //Llaves del usuario
    const UsrKeypair = Keypair.fromSecretKey(Decode(UsrSK58));
    const UsrPK = UsrKeypair.publicKey;

    //Transaccion
    const transaccion = new Transaction();
    const Pago = SystemProgram.transfer({
        fromPubkey: UsrPK,
        toPubkey: ServerPK,
        lamports: (Solecitos(n))
    });
    transaccion.add(Pago);

    //Firma de validacion
    const signature = sendAndConfirmTransaction(Conn(), transaccion, [UsrKeypair]);

    //retorno de la firma
    return signature;
}

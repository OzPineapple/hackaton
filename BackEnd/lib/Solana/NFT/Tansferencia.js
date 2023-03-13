import { Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
const { createAssociatedTokenAccount, createTransferCheckedInstruction, getMint } = require("@solana/spl-token");
import fs from "fs";
import { Conn, Decode } from "../Util.js";
export async function Transferencia(UsrSK58, minit) {
    //Llaves del servidor a este punto ya deberías saber que estoy haciendo
    const ServerW = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8"));
    const ServerSK = Uint8Array.from(ServerW);
    const ServerKeypair = Keypair.fromSecretKey(ServerSK);
    const ServerPK = ServerKeypair.publicKey;

    //Llaves del usuario
    const UsrKeypair = Keypair.fromSecretKey(Decode(UsrSK58));
    const UsrPK = UsrKeypair.publicKey;

    //Direccion del NFT
    const mintPk = new PublicKey(minit);

    //Guardamos la conexion en una variable
    const conn = Conn();

    //Sacamos el Token Accoount del server y la diereccion del NFT
    const ServerTokenAc = await conn.getTokenAccountsByOwner(ServerPK, { mint: mintPk });
    const ServerTokenAcPk = new PublicKey(ServerTokenAc.value[0].pubkey.toString());

    //Crea el Token Account del Usr
    let ata = await createAssociatedTokenAccount(conn, // connection
    ServerKeypair, // fee payer
    mintPk, // mint
    UsrPK // owner,
    );

    //Crea la transaccion con los datos proporcionados  
    let tx = new Transaction().add(createTransferCheckedInstruction(ServerTokenAc.value[0], // from (should be a token account)
    mintPk, // mint
    ata, // to (should be a token account)
    ServerPK, // from's owner
    1000000 //Este es el costo aqui debería ir el costo del boleto se deja fijo para pruebas
    ));

    //Funcion que recibe la firma de la transaccion
    var signature = await sendAndConfirmTransaction(conn, //Conexion
    tx, //transaccion
    [ServerW], //firmante
    { commitment: 'confirmed' });
    return signature;
}

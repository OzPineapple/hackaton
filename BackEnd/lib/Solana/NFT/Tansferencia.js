import { Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { createAssociatedTokenAccount, createTransferCheckedInstruction, createTransferInstruction, getMint, TOKEN_PROGRAM_ID }from "@solana/spl-token";
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
    //const ServerTokenAcPk = new PublicKey(ServerTokenAc.value[0].pubkey.toString());

    //Crea el Token Account del Usr
    let ata = await createAssociatedTokenAccount(conn, // connection
    ServerKeypair, // fee payer
    mintPk, // mint
    UsrPK // owner,
    );


    var transaccion = new  Transaction().add(
        createTransferInstruction(
            mintPk,
            ata,
            ServerKeypair.publicKey,
            1000000
        ),
    );


    var signature = await sendAndConfirmTransaction(
        conn,
        transaccion,
        [ServerKeypair],{
            maxRetries : 5
        }
    );

    console.log("SIGNATURE: ", signature);
    let tokenBalance = await ata.amount;
    console.log("token balance: ", tokenBalance);
}

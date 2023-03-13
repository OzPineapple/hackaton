import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Conn, Decode } from "../Util.js";
//Funcion que añade fondos a la cuenta

export async function AñadirFondos(x, UsrSK58) {
    //Saca la Keypair a traves de la SK
    const UsrKeypair = Keypair.fromSecretKey(Decode(UsrSK58));
    //Saca la PK atraves de la Keypair
    const UsrPK = UsrKeypair.publicKey;
    //Convierte el numero de lamports a soles enteros
    var SOL = (LAMPORTS_PER_SOL) * x;
    //Obtiene la conxion
    const conn = Conn();
    //Hace la solicitud de airdrop 
    const airdropSignature = await conn.requestAirdrop(UsrPK, SOL);
    //Retorna la firma del airdrop
    return airdropSignature;
}

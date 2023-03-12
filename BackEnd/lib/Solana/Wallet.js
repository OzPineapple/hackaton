import { Keypair, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { Decode, Encode, Solecitos, Conn } from "./Util.js";
//Crea una Wallet de 0 sin semilla
export function CreateWall() {
    //Genera las keypair
    var UsrKeypair = Keypair.generate();
    //Codifica la Secret key en base 58
    var UsrSK58 = Encode(UsrKeypair.secretKey);
    //Retorna la SK ya codificada en base 58
    return UsrSK58;
}
//Funcion para la transaccion entre cuentas
export function P2PTrasaction(sender, reciber, a) {
    //Usando las secret key para ontener los Kaypairs
    var SenderSK = Keypair.fromSecretKey(Decode(sender));
    var ReciberSK = Keypair.fromSecretKey(Decode(reciber));
    //Se obtienen las Public keys para la realizacion de la transferencia
    var SenderPK = SenderSK.publicKey;
    var ReciberPK = ReciberSK.publicKey;
    //Crea el nuevo objeto de transaccion
    var transaction = new Transaction();
    //Crea la estructura de transderencia de soles
    var SendSolInstruction = SystemProgram.transfer({
        fromPubkey: SenderPK,
        toPubkey: ReciberPK,
        lamports: Solecitos(a)
    });
    //Añade la transaccion de soles a la estructura de la trasaccion
    transaction.add(SendSolInstruction);
    var signature = sendAndConfirmTransaction(Conn(), transaction, [SenderSK]);
    //Regresa la firma de la transaccion
    return signature;
}
//Funcion para obtener el balance
export async function Balance(UsrSK58) {
    //Obtiene la conexion 
    const conn = Conn();
    //Obtiene Keypair de la SK de 
    var UsrKeypair = Keypair.fromSecretKey(Decode(UsrSK58));
    //Obtiene la Public Key de la Keypair
    var UsrPK = UsrKeypair.publicKey;
    //Obtiene el balance de la cuenta proprcionada
    var Balance = conn.getBalance(UsrPK);
    //Retorna el balance
    return Balance;
}

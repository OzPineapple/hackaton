import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
//Importacion para las transformaciones de base 58 y binario
import bs58 from "bs58";

//Crea una conexion con la testnet/devnet (nada más cambian el nombre)
export function Conn (){
    const conn = new Connection(clusterApiUrl('devnet'), "confirmed");
    return conn;
}

//Decodifica algo en base 58 y lo transforma a binario
export function Decode (ElemDecode : any){
    var  decode = bs58.decode(ElemDecode);
    return decode;
}

//Codifica algo en binario a base 58
export function Encode (ElemCode : any){
    var code = bs58.encode(ElemCode);
    return code;
}

//Transforma los precios de lamports a Solecitos como unidad 
export function Solecitos (IntSoles : any){
    var solecitos = (LAMPORTS_PER_SOL)*IntSoles;
    return solecitos;
}

//Funcion que regresa la tarifa por escribir en la red de solana entre dos cuentas
export async function Tarifa(Usr1 : any, Usr2 : any){
    //Obtiene la conexion
    var conn = Conn();
    //Obtiene el ultimo hasheo de bloques
    var recentBlockhash = await conn.getLatestBlockhash();

    //Crea una transaccion que es la que hace la solicitud
    const transction = new Transaction({
        recentBlockhash : recentBlockhash.blockhash,
        feePayer : Usr1
    }).add(
        SystemProgram.transfer({
            fromPubkey : Usr1,
            toPubkey : Usr2,
            lamports : 10
        })
    );
    //Guarda la tarifa obtenida
    const fees = await transction.getEstimatedFee(conn);
    
    //Regresa la tarifa
    return fees;

}

 
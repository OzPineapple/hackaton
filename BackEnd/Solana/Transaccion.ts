//Esta interfaz esta lista para el intercambio entre usuarios pero al no estar listo, ha sido comentado para su futura implementacion



/*
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
const web3 = require ('@solana/web3.js')
const connection = new Connection(clusterApiUrl('devnet'));
import fs from "fs";

//Extrae la wallet del programa


const wallet = JSON.parse(fs.readFileSync("$HOME/.config/solana/id.json"
, "utf-8"))
const secretKey =Uint8Array.from(wallet);
const keypair =Keypair.fromSecretKey(secretKey);


const senderK = Keypair.generate();
const recipentK = Keypair.generate();

async function transaction () {
    const airdropSignature = await connection.requestAirdrop(
        senderK.publicKey,
        web3.LAMPORTS_PER_SOL, // 10000000 Lamports in 1 SOL
      );
    
        console.log(airdropSignature);

      const sender =  senderK.publicKey;

      const recipient  = recipentK.publicKey;
      
      await connection.confirmTransaction(airdropSignature);
      
      const transaction = new Transaction();
      
      
      
      const sendSolInstruction = SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: recipient,
          lamports: LAMPORTS_PER_SOL * .1
      })
      
      transaction.add(sendSolInstruction);
      
      //las cuenmtas utilizadas no tienen baro creo
      const signature = sendAndConfirmTransaction(
          connection,
          transaction,
          [senderK]
      );
      
}


transaction();
*/

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
const web3 = require ('@solana/web3.js')
const connection = new Connection(clusterApiUrl('devnet'));
import fs from "fs";

//Extrae la wallet del programa

/*
const wallet = JSON.parse(fs.readFileSync("/Users/haru/.config/solana/id.json", "utf-8"))
const secretKey =Uint8Array.from(wallet);
const keypair =Keypair.fromSecretKey(secretKey);
*/

const senderK = Keypair.generate();
const recipentK = Keypair.generate();
//const publicKey = ownerKeypair.publicKey;

//var a  =  new PublicKey("3crhrzekJeTjB6UJeJjzG4qCowRUoKgj2fUpfhER5gqM");
(async () => {
    const airdropSignature = await connection.requestAirdrop(
        senderK.publicKey,
        web3.LAMPORTS_PER_SOL, // 10000000 Lamports in 1 SOL
      );
    
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
      
})





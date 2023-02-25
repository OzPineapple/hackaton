import {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    clusterApiUrl,
  } from "@solana/web3.js";

  const conn =  '"https://api.devnet.solana.com","confirmed"'

  export module EnvioSOL{
    export async function EnvioSol(){
      const fromKeypair = Keypair.generate();
      const toKeypair = Keypair.generate();
  
      //Crea la conexion a la devnet
      const connection = new Connection(conn);

      //
      const airdropSignature = await connection.requestAirdrop(fromKeypair.publicKey, LAMPORTS_PER_SOL);
  
      await connection.confirmTransaction(airdropSignature);
  
      const lamportsToSend = 1_000_000;
  
      const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toKeypair.publicKey,
          lamports: lamportsToSend,
        })
      );
  
    await sendAndConfirmTransaction(connection, transferTransaction, [fromKeypair,]);
    }
  }
  

//Calculo de costos de tarifas (Principalmente usado en el intercambio de boletos)

export module CalcTarifa{
  export async function calcTarifa(){
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    const payer = Keypair.generate();
    const payee = Keypair.generate();
  
    const recentBlockhash = await connection.getLatestBlockhash();
  
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash, 
      feePayer: payer.publicKey
    }).add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: payee.publicKey,
        lamports: 10,
      })
    );
  
    const fees = await transaction.getEstimatedFee(connection);
    console.log(`Estimated SOL transfer cost: ${fees} lamports`);
    // Estimated SOL transfer cost: 5000 lamports
  }
}
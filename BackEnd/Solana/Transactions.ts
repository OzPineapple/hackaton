import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";


// Contiene las instrucciones necesarias para hacer una trasaccion de soles y asignar los lamdports
export async function EnvioSol() {

  const fromKeypair = Keypair.generate();
  const toKeypair = Keypair.generate();

  console.log(fromKeypair.publicKey);

  //Crea la conexion a la devnet
  const connection = new Connection("https://api.devnet.solana.com");

  //Esto en teoria Firma soles y los transfiere
  const airdropSignature = await connection.requestAirdrop(fromKeypair.publicKey, LAMPORTS_PER_SOL);

  //Confirma la transaccion de soles (Hay que usar una versión superior de ser posible)
  await connection.confirmTransaction(airdropSignature);

  //Cantidad de lamports a asignar (Solo posible en testeos [Creo])
  const lamportsToSend = 1_000_000;

  //Crea la estructura de una transaccion y programa la transferencia
  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: lamportsToSend,
    })
  );
  //Confirma la transaccion

  console.log("Estamos aqio");
  await sendAndConfirmTransaction(connection, transferTransaction, [fromKeypair,]);
  console.log("transaccion completada");
}


//Calculo de costos de tarifas (Principalmente usado en el intercambio de boletos)

export async function calcTarifa() {
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


//Testeo 

//Funciona en teoría
//EnvioSol();
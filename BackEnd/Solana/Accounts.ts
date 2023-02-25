import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

//Creando una cuenta con semilla (se necesita correo+contraseña)
async function CrearCuenta(a: string, b: string) {

  //Necesito saber que hace exactamente esta madre
  let basePubkey = new PublicKey("G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY");
  //Genera la semilla 
  let seed = a + b;
  //No sé exactamente que hace hay que preguntar
  let programId = SystemProgram.programId;

  console.log(
    `${(
      await PublicKey.createWithSeed(basePubkey, seed, programId)
    ).toBase58()}`
  );

}

//Calcula el costo de una cuenta (Parece regresar la cantidad para la expecion de la)
async function CalAccountCost() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // length of data in the account to calculate rent for
  const dataLength = 1500;
  const rentExemptionAmount =
    await connection.getMinimumBalanceForRentExemption(dataLength);
  console.log({
    rentExemptionAmount,
  });
}


async function SystemAccount() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const fromPubkey = Keypair.generate();

  // Airdrop SOL for transferring lamports to the created account
  const airdropSignature = await connection.requestAirdrop(
    fromPubkey.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature);

  // amount of space to reserve for the account
  const space = 0;

  // Seed the created account with lamports for rent exemption
  const rentExemptionAmount =
    await connection.getMinimumBalanceForRentExemption(space);

  const newAccountPubkey = Keypair.generate();
  const createAccountParams = {
    fromPubkey: fromPubkey.publicKey,
    newAccountPubkey: newAccountPubkey.publicKey,
    lamports: rentExemptionAmount,
    space,
    programId: SystemProgram.programId,
  };

  const createAccountTransaction = new Transaction().add(
    SystemProgram.createAccount(createAccountParams)
  );

  await sendAndConfirmTransaction(connection, createAccountTransaction, [
    fromPubkey,
    newAccountPubkey,
  ]);

}

//Testing 

/*
var a = "Hola atodos";
var b = "EstamosBien";

CrearCuenta (a,b);
*/


//CalAccountCost();

SystemAccount();
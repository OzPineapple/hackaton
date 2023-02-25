import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import * as bs58 from "bs58";

//Creando una cuenta con semilla (se necesita correo+contraseña)

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

//Genera un hash de la cuenta 
async function GeneraCuenta(a: string, b: string) {

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

//Ahora sí que sí creamos cuenta
async function  CrearCuenta() {
  // connection
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
  const feePayer = Keypair.fromSecretKey(
    bs58.decode("588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2") 
  );

  // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  const base = Keypair.fromSecretKey(
    bs58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
    )
  );

  let basePubkey = base.publicKey;
  let seed = "robot001";
  let programId = SystemProgram.programId;

  let derived = await PublicKey.createWithSeed(basePubkey, seed, programId);

  const tx = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: feePayer.publicKey, // funder
      newAccountPubkey: derived,
      basePubkey: basePubkey,
      seed: seed,
      lamports: 1e8, // 0.1 SOL
      space: 0,
      programId: programId,
    })
  );

  console.log(
    `txhash: ${await sendAndConfirmTransaction(connection, tx, [
      feePayer,
      base,
    ])}`
  );
}


//Testing 


//var a = "Hola atodos";
//var b = "EstamosBien";

//GeneraCuenta (a,b);



//CalAccountCost();

//SystemAccount();

//CrearCuenta();
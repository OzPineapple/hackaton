import {
    SystemProgram,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    Connection,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    PublicKey,
  } from "@solana/web3.js";
  
  import * as bs58 from "bs58";

  //Crea el sistema de cuentas
  (async () => {
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
  })();

  //Calcula el costo de las cuentas
  export module CalCost{
    export async function calCon() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // length of data in the account to calculate rent for
    const dataLength = 1500;
    const rentExemptionAmount =
    await connection.getMinimumBalanceForRentExemption(dataLength);
    console.log({
      rentExemptionAmount,
    });
    }
  }

  //Creando una cuenta
  export module CrearCuenta{
    export async function crearCuenta(key){
      // connection
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const feePayer = Keypair.fromSecretKey(
      bs58.decode(key)
    );
  
    // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
    const base = Keypair.fromSecretKey(
      bs58.decode(key)
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
}

//Transferencia
export module HacerTrans{
  export async function hacerTrans(key){
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
    const feePayer = Keypair.fromSecretKey(
      bs58.decode(key)
    );
  
    // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
    const base = Keypair.fromSecretKey(
      bs58.decode(key)
    );
  
    let basePubkey = base.publicKey;
    let seed = "robot001";
    let programId = SystemProgram.programId;
  
    let derived = await PublicKey.createWithSeed(basePubkey, seed, programId);
  
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: derived,
        basePubkey: basePubkey,
        toPubkey: Keypair.generate().publicKey, // create a random receiver
        lamports: 0.01 * LAMPORTS_PER_SOL,
        seed: seed,
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
}
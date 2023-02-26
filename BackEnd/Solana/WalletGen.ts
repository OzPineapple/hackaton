import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

//Genera wallets tipo paper
async function GeneraCuenta(a: string, b: string) {

  //Necesito saber que hace exactamente esta madre
  let basePubkey = new PublicKey("3s7nubyZjqv4cEtPjzGiVahXThYCS8PSw4DNG9ApqAp3");
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

var a = "Carlita";
var b = "Amaro"

GeneraCuenta(a,b);
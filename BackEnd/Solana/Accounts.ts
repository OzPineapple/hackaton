import { clusterApiUrl, Connection, PublicKey, SystemProgram } from "@solana/web3.js";

//Creando una cuenta con semilla (se necesita correo+contraseña)
async function CrearCuenta(a : string, b : string) {

  //Necesito saber que hace exactamente esta madre
  let basePubkey = new PublicKey( "G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY");
  //Genera la semilla 
  let seed = a+b;
  //No sé exactamente que hace hay que preguntar
  let programId = SystemProgram.programId;

  console.log(
    `${(
      await PublicKey.createWithSeed(basePubkey, seed, programId)
    ).toBase58()}`
  );

}

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


//Testing 

/*
var a = "Hola atodos";
var b = "EstamosBien";

CrearCuenta (a,b);
*/


//CalAccountCost();
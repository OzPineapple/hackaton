import { PublicKey, SystemProgram } from "@solana/web3.js";

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

var a = "Hola atodos";
var b = "EstamosBien";

CrearCuenta (a,b);
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
let bs58 = require("bs58");

export async function GeneraCuenta() {
  const usrKpair = Keypair.generate();
  const ursSK = usrKpair.secretKey;
  const usrSk58 = bs58.encode(ursSK);
//  console.log(usrSk58);
  return usrSk58;
}

GeneraCuenta();

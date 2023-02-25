import { Keypair } from "@solana/web3.js";

module KeyGen {
  export function keyGen(){
    let keypair = Keypair.generate();
  };
}
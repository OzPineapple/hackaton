import { Connection, Keypair } from "@solana/web3.js";

export module KeyGen {
  export function keyGen(){
    let keypair = Keypair.generate();
  };
}

export module Connexion{
  export function conexion(){
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
  }
}
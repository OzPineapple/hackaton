import { clusterApiUrl, Connection, SystemProgram, Transaction } from "@solana/web3.js";
import * as bs58 from "bs58";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

let tx = new Transaction().add(
    // trasnfer SOL
    SystemProgram.transfer({
      fromPubkey: alice.publicKey,
      toPubkey: ata,
      lamports: amount,
    }),
    // sync wrapped SOL balance
    createSyncNativeInstruction(ata)
  );
  
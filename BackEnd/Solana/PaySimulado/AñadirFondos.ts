import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
const web3 = require ('@solana/web3.js')
const connection = new Connection(clusterApiUrl('devnet'));
import fs from "fs";

async function AddFondos(UsrPk) {
    const UserPk = new PublicKey(UsrPk);
    const airdropSignature = await connection.requestAirdrop(UserPk,web3.LAMPORTS_PER_SOL);

    return airdropSignature;
}

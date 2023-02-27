import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
const web3 = require ('@solana/web3.js')
const connection = new Connection(clusterApiUrl('devnet'));
import fs from "fs";

async function AddFondos(usrSk58:string) {

    const usrSk58aux = bs58.decode(usrSk58);
    const usrKeypair=  Keypair.fromSecretKey(usrSk58aux);
    const UsrPk = usrKeypair.publicKey
    
    const airdropSignature = await connection.requestAirdrop(UsrPk,web3.LAMPORTS_PER_SOL);
    return airdropSignature;
}
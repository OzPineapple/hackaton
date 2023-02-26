import { Metaplex, keypairIdentity, bundlrStorage, token } from "@metaplex-foundation/js";
import { createAssociatedTokenAccount, createTransferCheckedInstruction, getMint } from "@solana/spl-token";
import { Connection, clusterApiUrl, Keypair, PublicKey, Transaction } from "@solana/web3.js";
const web3 = require('@solana/web3.js');

import fs from "fs";


async function transf() {
    const connection = new Connection(clusterApiUrl("devnet"));

    const wallet = JSON.parse(fs.readFileSync("/Users/haru/.config/solana/id.json", "utf-8"))
    const secretKey =Uint8Array.from(wallet);
    const ownerA =Keypair.fromSecretKey(secretKey);
    const mintPk = new web3.PublicKey("HGwHSwAJUT3GiuhDuuZxoRJ9bxfzJFe6oJVcpZLeJcHd");
    const tokenAcOwnerA =await connection.getTokenAccountsByOwner(ownerA.publicKey,{mint : mintPk});
    console.log(tokenAcOwnerA.value[0]);
    
    var ownerB= new web3.PublicKey("gDQC6nFojPdH1cDQS2TXQNZGRQXvtkEKkERetPcd8TA");

    let mintAccount = await getMint(connection, mintPk);

    console.log(mintAccount);

    //owner
    var ownerAPk = ownerA.publicKey;



    //Reciber
    let ata = await createAssociatedTokenAccount(
        connection, // connection
        ownerA, // fee payer
        mintPk, // mint
        ownerB // owner,
      );
    //console.log(ownerAPk);

    
   // const nft = await metaplex.nfts().findByMint({ mintAddress })
/*
    console.log(nft);
    console.log("A public key" + ownerA.publicKey)
    console.log("A keypair object" + ownerA)
    console.log("A public key here too" + ownerAPk)
    console.log("B puiblic key"+ ownerB)
*/
    
    console.log("/////////////////");
    //const imageUrl = nft.json.image;
    let tx = new Transaction().add(
        createTransferCheckedInstruction(
          mintPk, // from (should be a token account)
          mintPk, // mint
          ata, // to (should be a token account)
          ownerAPk, // from's owner
          1, // amount, if your deciamls is 8, send 10^8 for 1 token
          0 // decimals
        )
      );
    console.log(tx);
    console.log(ata);
    console.log("WWWWWiiiiii");
}
transf();
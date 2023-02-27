const  { Metaplex, keypairIdentity, bundlrStorage, token }  = require( "@metaplex-foundation/js");
const  { createAssociatedTokenAccount, createTransferCheckedInstruction, getMint }  = require( "@solana/spl-token");
const  { Connection, clusterApiUrl, Keypair, PublicKey, Transaction }  = require( "@solana/web3.js");
const  bs58  = require( "bs58");
const web3 = require('@solana/web3.js');

const  fs  = require( "fs");


async function transf(usrSk58, minit) {
    //Conexion
    const connection = new Connection(clusterApiUrl("devnet"));

    //ServerKeypair
    const wallet = JSON.parse(fs.readFileSync("$HOME/.config/solana/id.json", "utf-8"))
    const ServerSK =Uint8Array.from(wallet);
    const ServerKeypair =Keypair.fromSecretKey(ServerSK);

    //UsrKeypair
    const usrSk58aux = bs58.decode(usrSk58);
    const usrKeypair=  Keypair.fromSecretKey(usrSk58aux);

    //UsrPublickey
    const UsrPk = usrKeypair.publicKey

    //DirNFT
    const mintPk = new web3.PublicKey(minit);

    //Sacamos Token account del server y la direccion del NFT
    const ServerTokenAc =await connection.getTokenAccountsByOwner(ServerKeypair.publicKey,{mint : mintPk});
    
    //Cuenta del NFT
    let mintAccount = await getMint(connection, mintPk);
    console.log(mintAccount);

    //Public key del Server
    var ServerPk = ServerKeypair.publicKey;



    //Crea token Account del Usr
    let ata = await createAssociatedTokenAccount(
        connection, // connection
        ServerKeypair, // fee payer
        mintPk, // mint
        UsrPk // owner,
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
    
    //const imageUrl = nft.json.image;
    let tx = new Transaction().add(
        createTransferCheckedInstruction(
          ServerTokenAc.value[0].pubkey, // from (should be a token account)
          mintPk, // mint
          ata, // to (should be a token account)
          UsrPk, // from's owner
          1, // amount, if your deciamls is 8, send 10^8 for 1 token
          0 // decimals
        )
      );
}



import { Conn } from '../Util.js';
import { keypairIdentity, Metaplex } from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from "fs";

const ServerW = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8"));
const ServerSK = Uint8Array.from(ServerW);
const ServerKeypair = Keypair.fromSecretKey(ServerSK);

const metaplex = Metaplex.make(Conn()).use(keypairIdentity(ServerKeypair));


export async function getMetadata(key){
  
    const mint = new PublicKey(key);
    
    console.log(key);
    console.log(mint);

    const nft = await metaplex.nfts().findByMint({mintAddress : mint});

    const A = nft.json.attributes;

    return nft;


}
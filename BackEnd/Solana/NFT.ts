import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const wallet = Keypair.generate();

const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());

var mintAddress;
const nft = await metaplex.nfts().findByMint({ mintAddress });

//En caso de que el servior no conecte
const abortController = new AbortController();
setTimeout(() => abortController.abort(), 100);


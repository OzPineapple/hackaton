import { clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(clusterApiUrl('devnet'));

async function getBalanceUsingWeb3(usrSk58:string): Promise<number> {
    const connection = new Connection(clusterApiUrl('devnet'));
    const usrSk58aux = bs58.decode(usrSk58);
    const usrKeypair=  Keypair.fromSecretKey(usrSk58aux);
    const UsrPk = usrKeypair.publicKey
    return connection.getBalance(UsrPk);
}
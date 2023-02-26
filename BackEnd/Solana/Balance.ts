import { clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl('devnet'));

async function getBalanceUsingWeb3(address: PublicKey): Promise<number> {
    const connection = new Connection(clusterApiUrl('devnet'));
    return connection.getBalance(address);
}
var Puk = "3s7nubyZjqv4cEtPjzGiVahXThYCS8PSw4DNG9ApqAp3";
const publicKey = new PublicKey(Puk)
getBalanceUsingWeb3(publicKey).then(balance => {
    console.log(balance);
})


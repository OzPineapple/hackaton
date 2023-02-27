const { clusterApiUrl, Connection, Keypair, PublicKey} = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl('devnet'));

module.exports = async (address) => {
    return await new Connection(clusterApiUrl('devnet')).getBalance(address);
}

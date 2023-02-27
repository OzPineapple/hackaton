const { clusterApiUrl, Connection, Keypair, PublicKey} = require("@solana/web3.js");

module.exports = async function getBalance(address) {
    return await new Connection(clusterApiUrl('devnet')).getBalance(address);
}

const { clusterApiUrl, Connection, Keypair, PublicKey} = require("@solana/web3.js");

<<<<<<< HEAD
const connection = new Connection(clusterApiUrl('devnet'));

module.exports = async (address) => {
=======
module.exports = async function getBalance(address) {
>>>>>>> 1e6f8e2d3c5e5c99befd29ebbdbff1ed50866446
    return await new Connection(clusterApiUrl('devnet')).getBalance(address);
}

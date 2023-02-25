
let tsimport = require("ts-import");

var x = "5rHi9DLr652DEo2ujWg5zzHUxCRrV5HJEj3fb8NeDSYa";

const Solana = async () => {
const balance = await tsimport.load("../Solana/Solana.ts");

console.log(balance.getBalance(x));
}
Solana(x);
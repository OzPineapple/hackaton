import * as Solana from "@solana/web3.js/lib/index.cjs";

//Constante de la Conexion
const connection = new Solana.Connection(Solana.clusterApiUrl('devnet'));

//Obteniendo el balance de una cuenta usando web3
async function getBalanceUsingWeb3(address: Solana.PublicKey): Promise<number> {
  return connection.getBalance(address);
}

export module GetBalance{
  export function getBalance(key){
    const publicKey = new Solana.PublicKey(key);
    getBalanceUsingWeb3(publicKey).then(balance =>{
      console.log(balance);
      return(balance);
    })
  }
}



//Usando una llave publica pre hecha

/*
const publicKey = new Solana.PublicKey('7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp')
getBalanceUsingWeb3(publicKey).then(balance => {
  console.log(balance)
})
*/

/*
async function getBalanceUsingJSONRPC(address: string): Promise<number> {
  const url = Solana.clusterApiUrl('devnet')
  console.log(url);
  return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getBalance",
          "params": [
              address
          ]
      })
  }).then(response => response.json())
  .then(json => {
      if (json.error) {
          throw json.error
      }

      return json['result']['value'] as number;
  })
  .catch(error => {
      throw error
  })
}
*/
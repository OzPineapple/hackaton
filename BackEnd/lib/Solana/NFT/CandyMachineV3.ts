import { Keypair, PublicKey } from "@solana/web3.js";
import { keypairIdentity, Metaplex, toBigNumber} from "@metaplex-foundation/js";
import fs from "fs";
import { Conn } from "../Util";

const ServerW = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8"));
const ServerSK = Uint8Array.from(ServerW);
const ServerKeypair = Keypair.fromSecretKey(ServerSK);
console.log(ServerKeypair.publicKey);
const metaplex = Metaplex.make(Conn()).use(keypairIdentity(ServerKeypair));



//Esta funcion crea una CM con unas caracteristicas en especifico, recibiendo simbolo y todo lo que lleva la coleccion
export async function CandyMachineSCreation(Simbol : String) {
    //Esta linea concatena el nombre Ticket con el simbolo (Abrebiatura asiganda)
    var NTicket = "Ticket" + Simbol;

    //Creamos la coleccion
    const { nft: collectionNft } = await metaplex.nfts().create({
        //Le colocamos nombre a la coleccion
        name: NTicket,
        //Aqui debería ir la uri correspondiente a la imagen de la COLECCION
        uri: 'Aqui va la uri correspondiente a la imagen a utilizar',
        //Establece si mal no recuerdo la cuota de reventa
        sellerFeeBasisPoints: 0,
        //Lo que hacemos es una coleccion?
        isCollection: true,
      });
      
    // Create the Candy Machine.
    const { candyMachine } = await metaplex.candyMachines().create({
        //Tiene candy guards?
        withoutCandyGuard: true,
        //Cuantos items tiene que crear
        itemsAvailable: toBigNumber(5000),
        //Puntos para la venta 
        sellerFeeBasisPoints: 333, // 3.33%
        collection: {
          address: collectionNft.address,
          updateAuthority: ServerKeypair,
        },
    });
    //Segun esta mamada ya esta creada la chingadera
    console.log(candyMachine.address);

}

export async function InizialiceCandymachine(Key : String) {
  const candyMachine = await metaplex
  .candyMachines()
  .findByAddress({ address: new PublicKey(Key) });
  return candyMachine;
}



export async function CreateNFT() {
  const { uri } = await metaplex.nfts().uploadMetadata({
    //Nombre del NFT
    name: "My NFT #1",
    //Descripcion del NFT
    description: "My description",
    //Url a la imagen
    image: "https://arweave.net/123",
  });

  return uri;
}

export async function InsertingItemsCM(uri : String, n : any) {
  var CM =  await InizialiceCandymachine(uri);
  for (let i = 0; i < n.length; i++) {
    await metaplex.candyMachines().insertItems({
      CM,
      items : [
        {name : n, uri: '1.json'}
      ],
    });
  }

  
}


var CMaddress = "7918isYkdPEJ8mpPevtmjYXAWU7MRhz9uAVc8nwSzcYZ"
InizialiceCandymachine(CMaddress)
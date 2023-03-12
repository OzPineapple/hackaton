import { Keypair, PublicKey } from "@solana/web3.js";
import { keypairIdentity, Metaplex, toBigNumber, toCandyMachine} from "@metaplex-foundation/js";
import fs from "fs";
import { Conn } from "../Util";

const ServerW = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8"));
const ServerSK = Uint8Array.from(ServerW);
const ServerKeypair = Keypair.fromSecretKey(ServerSK);
//console.log(ServerKeypair.publicKey);
const metaplex = Metaplex.make(Conn()).use(keypairIdentity(ServerKeypair));



//Esta funcion crea una CM con unas caracteristicas en especifico, recibiendo simbolo y todo lo que lleva la coleccion
export async function CandyMachineSCreation(Simbol : string) {
    //Esta linea concatena el nombre Ticket con el simbolo (Abrebiatura asiganda)
    var NTicket = "Ticket" + Simbol;

    //Creamos la coleccion
    const { nft: collectionNft } = await metaplex.nfts().create({
        //Le colocamos nombre a la coleccion
        name: NTicket + '#',
        symbol : Simbol,
        //Aqui debería ir la uri correspondiente a la imagen de la COLECCION
        uri: 'https://drive.google.com/file/d/1mhPC7WDIkJPrdtqU0nz7F6Ay9RcI838E/view?usp=share_link',
        //Establece si mal no recuerdo la cuota de reventa
        sellerFeeBasisPoints: 0,
        //Lo que hacemos es una coleccion?
        isCollection: true,
      });
      
    // Create the Candy Machine.
    const { candyMachine } = await metaplex.candyMachines().create({
        //Tiene candy guards?
        withoutCandyGuard: true,
        //Cuantos items tiene que crear (Creo que tiene algo que ver con el costo de la creacion)
        itemsAvailable: toBigNumber(1000),
        //Puntos para la venta 
        sellerFeeBasisPoints: 333, // 3.33%
        collection: {
          address: collectionNft.address,
          updateAuthority: ServerKeypair,
        },
    });
    console.log("Estamos aqui");
    //Segun esta mamada ya esta creada la chingadera
    console.log(candyMachine.address);

}


//Esta funcion busca una CM con su direccion (actualmente no veo una buena razon para descomentarla)
/*
export async function FetchCandymachine(Key : String) {
  const candyMachine = await metaplex
  .candyMachines()
  .findByAddress({ address: new PublicKey(Key) });
  return candyMachine;
}
*/




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

//Inserta items en la CM3, recibe la direccion de la CM, la Uri del JSOn y un Nombre el Nombre del nft más la iteracion(id del boleto)
export async function InsertingItemsCM(CMadress : String, uri : String, id : any) {

  const candyMachine = await metaplex
  .candyMachines()
  .findByAddress({ address: new PublicKey(CMaddress) });
 
  await metaplex.candyMachines().insertItems({
    candyMachine,
    items : [
      {name : id, uri: '1.json'}
    ],
  });
}


var CMaddress = "6kB8At33nJj3mWpEd9dRGfgRF47fwkeQH7ZJp1cGMHbe";

CandyMachineSCreation("PRD");

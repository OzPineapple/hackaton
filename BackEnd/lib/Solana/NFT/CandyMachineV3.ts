import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { bundlrStorage, keypairIdentity, Metaplex, toBigNumber, toCandyMachine, toDateTime, toMetaplexFile} from "@metaplex-foundation/js";
import fs from "fs";
import { Conn } from "../Util";
import { url } from "inspector";

const ServerW = JSON.parse(fs.readFileSync( "/Users/haru/.config/solana/id.json", "utf-8"));
const ServerSK = Uint8Array.from(ServerW);
const ServerKeypair = Keypair.fromSecretKey(ServerSK);
//console.log(ServerKeypair.publicKey);
//const metaplexCMv3 = Metaplex.make(Conn()).use(keypairIdentity(ServerKeypair));
const metaplex = Metaplex.make(Conn()).use(keypairIdentity(ServerKeypair)).use(bundlrStorage({
  address : 'https://devnet.bundlr.network',
  timeout: 60000,
}));


//Carga de imagen a Arewave Paso 1
export async function LoadImage(Url : string) {
    //Carga la imagen el buffer
    const imgBuffer = fs.readFileSync(Url);
    const imgMetaplexFile = toMetaplexFile(imgBuffer, "Prueba");
    const imgUri = await metaplex.storage().upload(imgMetaplexFile);
    console.log(`   Image URI:`,imgUri);
    return imgUri;
}

export async function LoadMetadata(nftName : string, description : string, imgUri : string, imgType : string, attributes : {trait_type : string, value : string}[]) {
  console.log(`Step 2 - Uploading Metadata`);
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
        name: nftName,
        description: description,
        image: imgUri,
        attributes: attributes,
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imgUri,
                },
            ]
        }
    });
    console.log('   Metadata URI:',uri);
    return uri;  
}

export async function CandyMachineSCreation(Simbol : string, dateS : string, dateE : string) {
    //Esta linea concatena el nombre Ticket con el simbolo (Abrebiatura asiganda)
    var NTicket = "Ticket " + Simbol;

    //Creamos la coleccion
    const { nft: collectionNft } = await metaplex.nfts().create({
        //Le colocamos nombre a la coleccion
        name: NTicket,
        symbol : Simbol,
        //Aqui debería ir la uri correspondiente a la imagen de la COLECCION
        uri: 'https://arweave.net/mf1-iPM3vyMpQQj7Mw6Y2mpe-v9vaHyeSHbRvJ8r7IU',
        //Establece si mal no recuerdo la cuota de reventa
        sellerFeeBasisPoints: 1000,
        //Lo que hacemos es una coleccion?
        isCollection: true,
        isMutable: true,
        updateAuthority : ServerKeypair

      });
      
    // Create the Candy Machine.
    const { candyMachine } = await metaplex.candyMachines().create({
        creators : [
          {address : ServerKeypair.publicKey, share : 100}
        ],
        collection: {
          address: collectionNft.address,
          updateAuthority: ServerKeypair,
        },
        guards: {
          startDate : {date :toDateTime(dateS)},
          endDate : {date : toDateTime (dateE)},
          mintLimit : {id : 1, limit : 5},
        },
        itemsAvailable: toBigNumber(1000),
        isMutable : true,
        //Puntos para la venta 
        sellerFeeBasisPoints: 333, // 3.33%
        symbol : Simbol,
        //Items maximos que la CMv3 puede crear
        maxEditionSupply : toBigNumber(0),
        //Tiene candy guards?
        withoutCandyGuard: true,
    });
    console.log("Estamos aqui");
    //Segun esta mamada ya esta creada la chingadera
    console.log(candyMachine.address);
    return candyMachine.address;

}


//Esta funcion busca una CM con su direccion (actualmente no veo una buena razon para descomentarla)

export async function FetchCandymachine(Key : String) {
  const candyMachine = await metaplex
  .candyMachines()
  .findByAddress({ address: new PublicKey(Key) });
  return candyMachine;
}

export async function Mint(metadataUri: string, name: string, sellerFee: number, symbol: string, creators: {address: PublicKey, share: number}[]){
    console.log(`Step 3 - Minting NFT`);
    const { nft } = await metaplex
    .nfts()
    .create({
        uri: metadataUri,
        name: name,
        sellerFeeBasisPoints: sellerFee,
        symbol: symbol,
        creators: creators,
        isMutable: true,
        maxSupply: toBigNumber(20)
    });
    console.log(`   Success!🎉`);
    console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
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

async function Test() {
var MetadataUri = "https://arweave.net/PeHHnFoJ5ussgXbGt7BMKbweeQ9TZ98el-M3hfvsPiw";
}

var CMaddress = "6kB8At33nJj3mWpEd9dRGfgRF47fwkeQH7ZJp1cGMHbe";

Test();

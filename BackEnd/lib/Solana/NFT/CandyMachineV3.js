import { Keypair, PublicKey } from "@solana/web3.js";
import { bundlrStorage, keypairIdentity, Metaplex, toBigNumber, toDateTime, toMetaplexFile } from "@metaplex-foundation/js";
import fs from "fs";
import { Conn } from "../Util.js";
const ServerW = JSON.parse(fs.readFileSync("/Users/haru/.config/solana/id.json", "utf-8"));
const ServerSK = Uint8Array.from(ServerW);
const ServerKeypair = Keypair.fromSecretKey(ServerSK);
const metaplex = Metaplex.make(Conn()).use(keypairIdentity(ServerKeypair)).use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    timeout: 60000,
}));
//Carga de imagen a Arewave Paso 1
export async function LoadImage(Url) {
    //Carga la imagen el buffer
    const imgBuffer = fs.readFileSync(Url);
    //Coloca en el archivo la imagen anteriormente colocada en el buffer
    const imgMetaplexFile = toMetaplexFile(imgBuffer, "Prueba");
    //Termina de Subir la imagen a metaplex ahora si que si
    const imgUri = await metaplex.storage().upload(imgMetaplexFile);
    //Retorna la url de la img para su posterior uso
    return imgUri;
}
//Carga la metadaata correspondiente la funcion requiere los siguientes parametros 
//nombre del Nft, la direccion de la url, el tipo de la imagen a cargar (generalmente es un PNG) y los atributos que contiene el nft 
export async function LoadMetadata(nftName, description, imgUri, imgType, attributes) {
    //La constante uri es la url que va a almacenar los datos del nft cuando se suban a Arwave
    const { uri } = await metaplex
        .nfts()
        .uploadMetadata({
        //creo que ya no tengo que repetir lo de arriba
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
    console.log('   Metadata URI:', uri);
    return uri;
}
//Esta funcion recibe el simbolo de la coleccion, la fecha de inicio de la venta y la fecha del final de la misma
export async function CandyMachineSCreation(Simbol, dateS, dateE) {
    //Esta linea concatena el nombre Ticket con el simbolo (Abrebiatura asiganda)
    var NTicket = "Ticket " + Simbol;
    //Creamos la coleccion
    const { nft: collectionNft } = await metaplex.nfts().create({
        //Le colocamos nombre a la coleccion
        name: NTicket,
        //insertamos el simbolo
        symbol: Simbol,
        //Aqui debería ir la uri correspondiente a la imagen de la COLECCION
        uri: 'https://arweave.net/mf1-iPM3vyMpQQj7Mw6Y2mpe-v9vaHyeSHbRvJ8r7IU',
        //Establece si mal no recuerdo la cuota de reventa
        sellerFeeBasisPoints: 1000,
        //Lo que hacemos es una coleccion?
        isCollection: true,
        //Es mutable la coleccion
        isMutable: true,
        //¿Quien puede actualizar la CM v3?
        updateAuthority: ServerKeypair
    });
    // Crea la Candy machine
    const { candyMachine } = await metaplex.candyMachines().create({
        //¿Quienes son los creadores? ¿Cuanto se llevan de la venta 
        creators: [
            { address: ServerKeypair.publicKey, share: 100 }
        ],
        //Detalles de la coleccion, la direccion de la misma 
        collection: {
            address: collectionNft.address,
            updateAuthority: ServerKeypair,
        },
        guards: {
            startDate: { date: toDateTime(dateS) },
            endDate: { date: toDateTime(dateE) },
            mintLimit: { id: 1, limit: 5 },
        },
        itemsAvailable: toBigNumber(1000),
        isMutable: true,
        //Puntos para la venta 
        sellerFeeBasisPoints: 333,
        symbol: Simbol,
        //Items maximos que la CMv3 puede crear
        maxEditionSupply: toBigNumber(0),
        //Tiene candy guards?
        withoutCandyGuard: true,
    });
    //Segun esta mamada ya esta creada la chingadera
    console.log(candyMachine.address);
    return candyMachine.address;
}
//Esta funcion busca una CM con su direccion
export async function FetchCandymachine(Key) {
    //Crea una CM que recibe de la busqueda 
    const candyMachine = await metaplex
        .candyMachines()
        .findByAddress({ address: new PublicKey(Key) });
    //Exporta la CM
    return candyMachine;
}
//Mintea los NFT
export async function Mint(metadataUri, name, sellerFee, symbol, creators) {
    console.log(`Step 3 - Minting NFT`);
    //Crea un objeto nft
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
export async function InsertingItemsCM(CMadress, uri, id) {
    const candyMachine = await metaplex
        .candyMachines()
        .findByAddress({ address: new PublicKey(CMaddress) });
    await metaplex.candyMachines().insertItems({
        candyMachine,
        items: [
            { name: id, uri: '1.json' }
        ],
    });
}
//Crea la funcion de testing
async function Test() {
    var MetadataUri = "https://arweave.net/PeHHnFoJ5ussgXbGt7BMKbweeQ9TZ98el-M3hfvsPiw";
}
var CMaddress = "6kB8At33nJj3mWpEd9dRGfgRF47fwkeQH7ZJp1cGMHbe";
Test();
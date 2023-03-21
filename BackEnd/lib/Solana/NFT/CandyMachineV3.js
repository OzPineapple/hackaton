import { Keypair, PublicKey } from "@solana/web3.js";
import { bundlrStorage, keypairIdentity, Metaplex, toBigNumber, toMetaplexFile } from "@metaplex-foundation/js";
import fs from "fs";
import {Conn, Encode} from "../Util.js";

const ServerW = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8"));
const ServerSK = Uint8Array.from(ServerW);
const ServerKeypair = Keypair.fromSecretKey(ServerSK);

const metaplex = Metaplex.make(Conn()).use(keypairIdentity(ServerKeypair)).use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: 'https://api.devnet.solana.com',
    timeout: 60000,
}));


//Carga de imagen a Arewave Paso 1
export async function LoadImage(Url, nombre) {
    //Carga la imagen el buffer
    const imgBuffer = fs.readFileSync(Url);
    //Coloca en el archivo la imagen anteriormente colocada en el buffer
    const imgMetaplexFile = toMetaplexFile(imgBuffer, nombre);
    //Termina de Subir la imagen a metaplex ahora si que si
    const imgUri = await metaplex.storage().upload(imgMetaplexFile);
    //Retorna la url de la img para su posterior uso
    return imgUri;
}

//Carga la metadaata correspondiente la funcion requiere los siguientes parametros 
//nombre del Nft, la direccion de la url, el tipo de la imagen a cargar (generalmente es un PNG) y los atributos que contiene el nft 
export async function LoadMetadataCollection(nftName, description, imgUri, imgType) {
    //La constante uri es la url que va a almacenar los datos del nft cuando se suban a Arwave
    const { uri } = await metaplex.nfts() .uploadMetadata({
        //Aqui va el nombre del nft
        name: nftName,
        //Aqui va su descripcion (Es diferente para la coleccion y para el boleto)
        description: description,
        //Url de la imagen subida a arewavae
        image: imgUri,
        //Que archivos y de que tipo estan linkeados aqui
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imgUri,
                },
            ]
        }
    },{ commitment: "finalized" }
    );
    //Retorna la URL de la metadata ya montada en la nube (Arewave)
    return uri;
}

//Carga la metadaata correspondiente la funcion requiere los siguientes parametros 
//nombre del Nft, la direccion de la url, el tipo de la imagen a cargar (generalmente es un PNG) y los atributos que contiene el nft 
export async function LoadMetadata(nftName, description, imgUri, imgType, attributes) {
    //La constante uri es la url que va a almacenar los datos del nft cuando se suban a Arwave
    const { uri } = await metaplex.nfts().uploadMetadata({
        //Aqui va el nombre del nft
        name: nftName,
        //Aqui va su descripcion (Es diferente para la coleccion y para el boleto)
        description: description,
        //Url de la imagen subida a arewavae
        image: imgUri,
        //Atributos del boleto, puede estar blanco en caso de que no haya
        attributes: attributes,
        //Que archivos y de que tipo estan linkeados aqui
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imgUri,
                },
            ]
        }
    });
    //Retorna la URL de la metadata ya montada en la nube (Arewave)
    return uri;
}

//Funcion que carga la metadata pero sin attributos
export async function LoadMetadataNoAttributes(nftName, description, imgUri, imgType) {
    //La constante uri es la url que va a almacenar los datos del nft cuando se suban a Arwave
    const { uri } = await metaplex .nfts().uploadMetadata({
        //Aqui va el nombre del nft
        name: nftName,
        //Aqui va su descripcion (Es diferente para la coleccion y para el boleto)
        description: description,
        //Url de la imagen subida a arewavae
        image: imgUri,
        //Que archivos y de que tipo estan linkeados aqui
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imgUri,
                },
            ]
        }
    });
    //Retorna la URL de la metadata ya montada en la nube (Arewave)
    return uri;
}

//Esta funcion recibe el simbolo de la coleccion, la fecha de inicio de la venta y la fecha del final de la misma
export async function CrearColeccionNFT(Nombre, metaData, TarifaReventa) {
    //Esta linea concatena el nombre Ticket con el simbolo (Abrebiatura asiganda)
    //Creamos la coleccion
    const { nft: collectionNft } = await metaplex.nfts().create({
        name: Nombre,
        uri: metaData,
        sellerFeeBasisPoints: TarifaReventa,
        isCollection: true,
        updateAuthority: ServerKeypair,
      }, { commitment: "finalized" }

      );
      return collectionNft.address;
}

//Esta funcion recibe el simbolo de la coleccion, la fecha de inicio de la venta y la fecha del final de la misma
export async function CandyMachineSCreation(uriCollection, Simbolo, BoletosDisponibles) { 

    const { candyMachine } = await metaplex.candyMachines().create({
         //¿Quienes son los creadores? ¿Cuanto se llevan de la venta 
         creators: [
            { address: ServerKeypair.publicKey, share: 100 }
        ],
        //Detalles de la coleccion, la direccion de la misma 
        collection: {
            address: uriCollection,
            updateAuthority: ServerKeypair,
        },
        guards: {
            //startDate: { date: toDateTime(dateS) },
            //endDate: { date: toDateTime(dateE) },
            mintLimit: { id: 1, limit: 5 },
        },
        isMutable: true,
        itemsAvailable: toBigNumber(BoletosDisponibles),
        //Puntos para la venta 
        sellerFeeBasisPoints: 333,
        symbol: Simbolo,
        //Items maximos que la CMv3 puede crear
        maxEditionSupply: toBigNumber(0),
        //Tiene candy guards?
        withoutCandyGuard: true,

    }, { commitment: "finalized" }
    );

    //Segun esta mamada ya esta creada la chingadera
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

//Inserta items en la CM3, recibe la direccion de la CM, la Uri del JSOn y un Nombre el Nombre del nft más la iteracion(id del boleto)
export async function InsertingItemsCM(CMaddress, nombre, uriMetadata) {
    const candyMachine = await FetchCandymachine (CMaddress);
    
    const items = [];
        items.push({
            name : nombre,
            uri : uriMetadata
        })
    const {response} = await metaplex.candyMachines().insertItems({
        candyMachine,
        items : items,
    },{ commitment: "finalized" });

    console.log (response);
    return response;
}

//Mintea los NFT
export async function Mint(CMaddress, Usr58) {

    //Crea un objeto nft
    const candyMachine = await metaplex.candyMachines().findByAddress({address : new PublicKey(CMaddress)});
    const collectionUpdateAuthority = ServerKeypair.publicKey;

    const UsrPK58 = new PublicKey(Usr58);

    let {nft} = await metaplex.candyMachines().mint({
            candyMachine,
            collectionUpdateAuthority,
            owner : UsrPK58
            
    },{commitment : "finalized"});

    return nft.address;
}

//Mint to usr
export async function MintToUsr(CMaddress) {

    //Crea un objeto nft
    const candyMachine = await metaplex.candyMachines().findByAddress({address : new PublicKey(CMaddress)});
    const collectionUpdateAuthority = ServerKeypair.publicKey;

    let {nft} = await metaplex.candyMachines().mint({
            candyMachine,
            collectionUpdateAuthority,
            
    },{commitment : "finalized"});

    return nft.address;

}

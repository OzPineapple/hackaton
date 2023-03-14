
import { CreateWall, Balance} from './Solana/Wallet.js';
import { LoadImage, LoadMetadata, CrearColeccionNFT, CandyMachineSCreation } from './Solana/NFT/CandyMachineV3.js'
import fs from "fs";

import {Keypair} from '@solana/web3.js';

export { getPubKey } from './Solana/Wallet.js';
import {GetOwnerFromAMint } from './Solana/NFT/NFT.js'
import { CompraBoleto } from './Solana/Pay/Compra.js';
import { AñadirFondos } from './Solana/Pay/AñadirFondos.js';
import { Transferencia } from './Solana/NFT/Tansferencia.js';
import {Mint, LoadMetadataCollection, InsertingItemsCM} from './Solana/NFT/CandyMachineV3.js'
import { Conn } from './Solana/Util.js';
import { keypairIdentity, Metaplex } from '@metaplex-foundation/js';


const ServerW = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8"));
const ServerSK = Uint8Array.from(ServerW);
const ServerKeypair = Keypair.fromSecretKey(ServerSK);

const metaplex = new Metaplex(Conn()).use(keypairIdentity(ServerKeypair));


//Nota voy a suponer que las imagenes cargadas al nft solo serán en formato png, en caso de que no, favor de avisar para convertir el tipo de la imagen en un
//string variable, deacuerdo a la imagen cargada, Debe de recbir un arreglo de objetos llamado Atributos (No deberia estar la funcion de subir imagen)
export async function CreateACollection (Nombre, LocalUriImg, Descripcion, TarifaReventa, Simbolo, BoletosDisponibles ){

	var imgUri = await LoadImage(LocalUriImg, Nombre);
	var metaData =  await LoadMetadataCollection(Nombre, Descripcion,imgUri, "img/png");
	var uriCollection =   await CrearColeccionNFT(Nombre, metaData, TarifaReventa);
	var CMaddress =  await CandyMachineSCreation(uriCollection, Simbolo, BoletosDisponibles);

	var objetos = [];
	objetos.push({
		ImgUri : imgUri,
		MetaDataUrl : metaData,
		UriCollection : uriCollection.toString(),
		CmAddress : CMaddress.toString()
	})
	
	return objetos;
}

export async function CreateNFTNoAttributes(Nombre, CMaddress, UriMetadata){
	let {response} = await InsertingItemsCM(CMaddress, Nombre, UriMetadata);

	return response;
}

export async function MintNft(CMaddress, UsrPK58){ 
	var nftAddress = await Mint(CMaddress, UsrPK58);

	return nftAddress.toString();
}

export async function Compra(){
	let signature = await CompraBoleto(UsrSK58, x);

	if (signature != null ){
		let signatureTx = await Mint (UsrSK58, mint);
		return signatureTx
	} else {
		return "Algo ha salido mal"; 
	};
}

export function CreateWallet(){
	CreateWall();
}

export async function Añadir(x, UsrSK58){
	let airdropSignature =	AñadirFondos(x, UsrSK58);
	return airdropSignature;
}

export function createWallet(){
	return CreateWall();
}

export function getBalance(){
	return Balance();
}


export async function getOwnerFromAMint(mint){
	return await GetOwnerFromAMint(mint);
}
getOwnerFromAMint("9hhpF8P353ejCGsFda91W4CngK6Ew6qBwuJvkYU7FFdw");





//Funciones utiles que no se estan usando
export async function CreateNFT(Nombre, Descripcion, imgUri, CMaddress, Seccion, Asiento){
	
	var UriMetadata =  await LoadMetadata(Nombre, Descripcion,imgUri, "img/png",[
		{"trait_type" :  "Valido", "value" : "true"},
		{"trait_type" : "Seccion", "value" : Seccion},
		{"trait_type" : "Asiento", "value" : Asiento}
	]);
	
	let {response} = await InsertingItemsCM(CMaddress, Nombre, UriMetadata);
	
}

export async function CompraYTransfer(x, UsrSK58, mint){
	let signature = await CompraBoleto(UsrSK58, x);

	if (signature != null ){
		let signatureTx = await Transferencia(UsrSK58, mint);
		return signatureTx
	} else {
		return "Algo ha salido mal"; 
	};
}

export async function GetAndFilrtMetadata(UsrPK){
	var BoletosSinUsar = [];
	
	let TAc = await GetTokenAccounts(UsrPK); 
	var i = 0;
	
	while(TAc.value[i] != undefined){
	
		var nft = await getMetadata(AccountLayout.decode(TAc.value[i].account.data).mint.toString());

		
		console.log("iteracion:  " + i);
		if(nft.json != undefined){
			if(nft.json.attributes != undefined){
				if (nft.json.attributes[0] != undefined){
					console.log(nft.json.attributes[0].value);
				if (nft.json.attributes[0].value == "true") {
					BoletosSinUsar.push(nft);
				}
				}
			}
		}
		
		i++;
	}

	return BoletosSinUsar;
}



//Esta madre esta fuera de juego por la nueva forma de crear nft y almacenarlas en la base de datos
/*

*/

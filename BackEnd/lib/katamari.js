import debuger from 'debug';

import { CreateWall, Balance} from './Solana/Wallet.js';
import { LoadImage, LoadMetadata, CrearColeccionNFT, CandyMachineSCreation } from './Solana/NFT/CandyMachineV3.js'
import {Keypair} from '@solana/web3.js';
import {GetOwnerFromAMint } from './Solana/NFT/NFT.js'
import { CompraBoleto } from './Solana/Pay/Compra.js';
import { AñadirFondos } from './Solana/Pay/AñadirFondos.js';
import { Transferencia } from './Solana/NFT/Tansferencia.js';
import {Mint, LoadMetadataCollection, InsertingItemsCM} from './Solana/NFT/CandyMachineV3.js'
import { Decode } from './Solana/Util.js';
import { genPubKey } from './Solana/Wallet.js';

const debug = debuger('server:katamari');

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

	debug(objetos);
	
	return objetos;
}

export async function CreateNFTNoAttributes(Nombre, CMaddress, UriMetadata){
	debug(Nombre, CMaddress, UriMetadata);
	let {response} = await InsertingItemsCM(CMaddress, Nombre, UriMetadata);

	return response;
}

export async function MintNft(CMaddress, UsrPK58){ 
	var nftAddress = await Mint(CMaddress, UsrPK58);

	return nftAddress.toString();
}

export async function Compra(UsrSK58, Precio, CMaddress){
	let signature = await CompraBoleto(UsrSK58, Precio);
	
	var UsrSK = Decode(UsrSK58);
	var UsrKeypair = Keypair.fromSecretKey(UsrSK);
	var UsrPK58 = UsrKeypair.publicKey.toString();


	if (signature != null ){
		let signatureTx = await Mint(CMaddress, UsrPK58);
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

export function getBalance(privK){
	return Balance(privK);
}

export function getPubKey (Usr58){
	return genPubKey(Usr58);
}

export async function getOwnerFromAMint(mint){
	return await GetOwnerFromAMint(mint);
}


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


//Hacer la mamada de matarlos
export async function GetAndFilrtMetadata(UsrPK){
	var BoletosSinUsar = [];
	
	let TAc = await GetTokenAccounts(UsrPK); 
	var i = 0;
	
	while(TAc.value[i] != undefined){
	
		var nft = await getMetadata(AccountLayout.decode(TAc.value[i].account.data).mint.toString());

		
		debug("iteracion:  " + i);
		if(nft.json != undefined){
			if(nft.json.attributes != undefined){
				if (nft.json.attributes[0] != undefined){
					debug(nft.json.attributes[0].value);
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


/*
async function main(){
	await CreateACollection(
		'Jinx concert',
		'./lib/Solana/NFT/Pruebas/jinx.png',
		'Concierto de Jinx',
		1000,
		"jinx",
		5
	)
}
*/

/*
async function main(){
	for (let index = 0; index < 5; index++) {
		var res = await CreateNFTNoAttributes(
			'ticket', // name
			'Ko1ybs8ncQGohywY88MaJkDvYVefKzuAS2Pwd62RcoV', // candy machine address
			'https://arweave.net/-tOw3vdYO8y-ztgGnNqxevZX9-APF-DDZ1cBk7UlCk0', // uri matadata
		)
		debug(res);
	}
}
*/

import { GetTokenAccounts, CreateWall, Balance, P2PTrasaction } from './Solana/Wallet.js';
import { LoadImage, LoadMetadata, CrearColeccionNFT, CandyMachineSCreation } from './Solana/NFT/CandyMachineV3.js'
import { AccountLayout } from "@solana/spl-token";

import { getMetadata } from './Solana/NFT/NFT.js'
import { CompraBoleto } from './Solana/Pay/Compra.js';
import { AñadirFondos } from './Solana/Pay/AñadirFondos.js';
import { Transferencia } from './Solana/NFT/Tansferencia.js';
import {Mint, LoadMetadataCollection, InsertingItemsCM} from './Solana/NFT/CandyMachineV3.js'

export { getPubKey } from './Solana/Wallet.js';

//Nota voy a suponer que las imagenes cargadas al nft solo serán en formato png, en caso de que no, favor de avisar para convertir el tipo de la imagen en un
//string variable, deacuerdo a la imagen cargada, Debe de recbir un arreglo de objetos llamado Atributos (No deberia estar la funcion de subir imagen)
export async function CreateACollection (Nombre, LocalUriImg, Descripcion, TarifaReventa, Simbolo, BoletosDisponibles ){
	
	var imgUri = await LoadImage(LocalUriImg, Nombre);
	console.log("Se ha subido la imagen con exito");

	var metaData =  await LoadMetadataCollection(Nombre, Descripcion,imgUri, "img/png");
	console.log("Se ha cargado la metadata con exito");

	var uriCollection =   await CrearColeccionNFT(Nombre, metaData, TarifaReventa);
	console.log("Se ha creado la coleccion con exito");

	//Esta madre deberia recibir una fecha de inicio y una fecha de fin para la impresion de NFT
	var CMaddress =  await CandyMachineSCreation(uriCollection, Simbolo, BoletosDisponibles);
	console.log("Se ha creado la CM con exito");


	var objetos = [];
	objetos.push({
		ImgUri : imgUri,
		MetaDataUrl : metaData,
		UriCollection : uriCollection.toString(),
		CmAddress : CMaddress.toString()
	})
	console.log(objetos);
	
	return objetos;
	
}

export async function CreateAndMintNFT(Nombre, Descripcion, imgUri, CMaddress, Seccion, Asiento){
	/*
	var UriMetadata =  await LoadMetadata(Nombre, Descripcion,imgUri, "img/png",[
		{"trait_type" :  "Valido", "value" : "true"},
		{"trait_type" : "Seccion", "value" : Seccion},
		{"trait_type" : "Asiento", "value" : Asiento}
	]);
	console.log("Se ha creado la Metadata");
	
	let {response} = await InsertingItemsCM(CMaddress, Nombre, UriMetadata);
	console.log("Se han insertado el item")
	*/
	
	let {response2} = await Mint(CMaddress);
	console.log("Se ha minteado con exito")
	
}

var Nombre = "Dulces toxicos Collection";
var LocalUriImg = "./Solana/NFT/Pruebas/HaruVsSolana.png";
var Descripcion = "Primer boletazo";
var TarifaReventa = 1000;
var Simbolo = "SPM";
var BoletosDisponibles = 3;

var imgUri = "https://arweave.net/o-dySz3om1J3k0e1ChEScQTvyejyL6Pz0TSGxM3U43g";
var CMaddress = "5dQLygZ3CN2L8takjrL3aGCQaZZ8jadMBNDPYMBLGiMJ"
var Seccion = "A";
var Asiento = "01";

//CreateACollection(Nombre, LocalUriImg, Descripcion,TarifaReventa, Simbolo, BoletosDisponibles);

CreateAndMintNFT(Nombre, Descripcion, imgUri, CMaddress, Seccion, Asiento);



/*
var Simbolo = "SUS"
var Nombre = "Ticket " + Simbolo;
var Descripcion = "Boleto para...";
var imgUri = 'https://arweave.net/sKdrGsFSXfTHpC9huAjSepC7xE9zmTTiW0tgmA8eHZw';
var CMaddress = "AusvpxXaJg3LJrT9kQ6SbiWCN4Ry43iytyyaVBDjSGT8";
var Seccion = "A";
var Asiento = "10";
CreateAndMintNFT(Nombre, Descripcion, imgUri, CMaddress, Seccion, Asiento)

*/



/*


*/



/*





export function CreateWallet(){
	CreateWall();
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

//x es la cantidad en Soles de la compra, UsrSK58 es auto explicativo, Minit es la direccion del nft, NO de la TAc (Esta configurado para el server si necesitas validar las reventas avisame)
export async function CompraYTransfer(x, UsrSK58, minit){
	let signature = await CompraBoleto(UsrSK58, x);
	let signatureTx = await Transferencia(UsrSK58, mint);
	
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


async function test() {
	var BoletosSinUsar = [];
	BoletosSinUsar = await GetAndFilrtMetadata("3s7nubyZjqv4cEtPjzGiVahXThYCS8PSw4DNG9ApqAp3");
	console.log(BoletosSinUsar[0].address.toString())
}
test();


*/


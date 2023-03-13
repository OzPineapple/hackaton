
import { GetTokenAccounts, CreateWall, Balance, P2PTrasaction } from './Solana/Wallet.js';
import { LoadImage, LoadMetadata, CrearColeccionNFT, CandyMachineSCreation } from './Solana/NFT/CandyMachineV3.js'
import { AccountLayout } from "@solana/spl-token";

import { getMetadata } from './Solana/NFT/NFT.js'
import { CompraBoleto } from './Solana/Pay/Compra.js';
import { AñadirFondos } from './Solana/Pay/AñadirFondos.js';
import { Transferencia } from './Solana/NFT/Tansferencia.js';

export { getPubKey } from './Solana/Wallet.js';

//Nota voy a suponer que las imagenes cargadas al nft solo serán en formato png, en caso de que no, favor de avisar para convertir el tipo de la imagen en un
//string variable, deacuerdo a la imagen cargada, Debe de recbir un arreglo de objetos llamado Atributos (No deberia estar la funcion de subir imagen)
export async function CreateACollection (Nombre, LocalUriImg, Descripcion, TarifaReventa, Simbolo ){
	
	var imgUri = await LoadImage(LocalUriImg, Nombre);

	var metaData =  await LoadMetadataCollection(Nombre, Descripcion,imgUri, "img/png");

	var uriCollection =   await CrearColeccionNFT(Nombre, metaData, TarifaReventa);

	console.log(uriCollection);
	
	//Esta madre deberia recibir una fecha de inicio y una fecha de fin para la impresion de NFT
	var CMaddress =  await CandyMachineSCreation(uriCollection, Simbolo, BoletosDisponibles);

	var {cosas} = ({ ImgUri : imgUri, metaDataUrl: metaData, CmAddress : CMaddress});

	console.log(cosas);

	return cosas;
}


export async function CreateAndMintNFT(Nombre, Descripcion, imgUri, CMaddress, Seccion, Asiento){
	/*
	var UriMetadata =  await LoadMetadata(Nombre, Descripcion,imgUri, "img/png",[
		{"trait_type" :  "Valido", "value" : "true"},
		{"trait_type" : "Seccion", "value" : Seccion},
		{"trait_type" : "Asiento", "value" : Asiento}
	]);

	let {response} = await InsertingItemsCM(CMaddress, Nombre, UriMetadata);
*/
	
	let {response2} = await Mint(CMaddress);

	console.log("Funciona esta madre creo")
}

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


/*
var Simbolo = "SUS"
var Nombre = "Ticket " + Simbolo;
var Descripcion = "Boleto para...";
var imgUri = "https://arweave.net/pnplCDRsW0nKEyMQRP6gk46fk0zZWa-RbhZRX3Dwepk";
var CMaddress = "C44qvmZGo6bP3KWBsk54pMisoiKZCtLU77ii62BkRHFC";
var Seccion = "A";
var Asiento = "10";


CreateAndMintNFT(Nombre, Descripcion, imgUri, CMaddress, Seccion, Asiento)
*/

/*
async function test() {
	var BoletosSinUsar = [];
	BoletosSinUsar = await GetAndFilrtMetadata("3s7nubyZjqv4cEtPjzGiVahXThYCS8PSw4DNG9ApqAp3");
	console.log(BoletosSinUsar[0].address.toString())
}
test();
*/

/*
var Nombre = "KatamariTour Collection";
var LocalUriImg ="./Solana/NFT/Pruebas/prueba.png";
var Descripcion = "Boleto para ...";
var Seccion = "A";
var Simbolo = "SUS"
var  Asiento = "10";
var TarifaReventa = "1000";
var BoletosDisponibles = 10;

CreateACollection(Nombre, LocalUriImg, Descripcion, Seccion, Asiento, TarifaReventa, Simbolo);

*/

export function createWallet(){
	return CreateWall();
}

export function getBalance(){
	return Balance();
}
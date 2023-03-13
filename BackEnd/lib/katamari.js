import { GetTokenAccounts,CreateWall, Balance, P2PTrasaction } from './Solana/Wallet.js';
import { LoadImage, LoadMetadata, CrearColeccionNFT, CandyMachineSCreation } from './Solana/NFT/CandyMachineV3.js'
import { AccountLayout } from "@solana/spl-token";
import { getMetadata } from './Solana/NFT/NFT.js'


//Nota voy a suponer que las imagenes cargadas al nft solo serán en formato png, en caso de que no, favor de avisar para convertir el tipo de la imagen en un
//string variable, deacuerdo a la imagen cargada, Debe de recbir un arreglo de objetos llamado Atributos (No deberia estar la funcion de subir imagen)
export async function CreateACollection (Nombre, LocalUriImg, Descripcion, Seccion, Asiento, TarifaReventa, Simbolo ){
	
	var imgUri = await LoadImage(LocalUriImg, Nombre);

	var metaData =  await LoadMetadata(Nombre, Descripcion,imgUri, "img/png", [  
		{"trait_type" : "Usado",   "value" : "false"},
		{"trait_type" : "Seccion", "value" : Seccion},
		{"trait_type" : "Asiento", "value" : Asiento}
	]);

	var uriCollection =   await CrearColeccionNFT(Nombre, metaData, TarifaReventa);

	console.log(uriCollection);
	
	//Esta madre deberia recibir una fecha de inicio y una fecha de fin para la impresion de NFT
	var CMaddress =  await CandyMachineSCreation(uriCollection, Simbolo, BoletosDisponibles);

	var {cosas} = ({ ImgUri : imgUri, metaDataUrl: metaData, CmAddress : CMaddress});

	return cosas;
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
			if(nft.json.attributes[0] != undefined){
				console.log(nft.json.attributes[0].value);
				if (nft.json.attributes[0].value == "false") {
					BoletosSinUsar.push(nft);
				}
			}
		}
		
		i++;
	}

	return BoletosSinUsar;
}

async function test() {
	var BoletosSinUsar = [];
	BoletosSinUsar = await GetAndFilrtMetadata("3s7nubyZjqv4cEtPjzGiVahXThYCS8PSw4DNG9ApqAp3");
	console.log(BoletosSinUsar[0].address.toString())
}

test();
/*
var Nombre = "KatamariTour Collection";
var LocalUriImg ="./Solana/NFT/Pruebas/katamari.png";
var Descripcion = "Boleto para ...";
var Seccion = "A";
var Simbolo = "SUS"
var  Asiento = "10";
var TarifaReventa = "1000";
var BoletosDisponibles = 3;

2uTsiK6DjnZWjhAEYSjRFQNStXtHU9grkRHGcMyRqtF4

CreateACollection(Nombre, LocalUriImg, Descripcion, Seccion, Asiento, TarifaReventa, Simbolo);
*/

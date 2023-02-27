#!/bin/sh

tar -cvf server.tar \
	../BackEnd/Solana \
	../BackEnd/lib \
	../BackEnd/package.json \
	../BackEnd/public \
	../BackEnd/routes \
	../BackEnd/server.js \
	../DBFiles/Admin.csv \
	../DBFiles/Boleto.csv \
	../DBFiles/Evento.csv \
	../DBFiles/Ubicacion.csv \
	../DBFiles/Usuario.csv \
	../DBFiles/import.bash \
	../DBFiles/tipoEvento.csv \
	hackaton.service


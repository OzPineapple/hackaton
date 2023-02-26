#!/bin/sh

tar -cvf server.tar \
	../BackEnd/lib \
	../BackEnd/package.json \
	../BackEnd/public \
	../BackEnd/routes \
	../BackEnd/server.js
tar -cvf database.tar \
	../DBFiles/Admin.csv \
	../DBFiles/Boleto.csv \
	../DBFiles/Evento.csv \
	../DBFiles/Ubicacion.csv \
	../DBFiles/Usuario.csv \
	../DBFiles/import.bash \
	../DBFiles/tipoEvento.csv

#!/bin/bash
URI="mongodb://127.0.0.1:27017"
DATABASE="TicketMunster"
TYPE="csv"
OPTS="--headerline"

echo "Usando base de datos: " $DATABASE

for file in *.$TYPE
do
	COLLECTION=$( basename $file .$TYPE )
	echo "Importando archivo: " $file ". En colecion: " $COLLECTION;
	mongoimport --db=$DATABASE --collection=$COLLECTION --type=$TYPE $OPTS $file
done

echo "Script finalizado"

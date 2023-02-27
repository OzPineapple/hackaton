.SILENT:

DATABASE="TicketMunster"

default: run

run:
	npm --prefix $(shell pwd)/BackEnd start

install: install-database install-server

install-server:
	npm --prefix $(shell pwd)/BackEnd install

install-database:
	echo "Usando base de datos: " ${DATABASE}
	for file in DBFiles/*.csv;\
	do \
		COLLECTION=$$(basename $$file .csv); \
		echo "Importando archivo: " $$file ". En colecion: " $$COLLECTION; \
		mongoimport --db=${DATABASE} --collection=$$COLLECTION --type=csv --headerline $$file; \
	done

uninstall: uninstall-server uninstall-database

uninstall-server:
	rm -rvf BackEnd/node_modules

uninstall-database:
	mongosh TicketMunster --eval "db.dropDatabase()"

# .SILENT:

DATABASE="TicketMunster"
AWS_SERVER=$(shell cat etc/public-dns )

default: run

run:
	npm --prefix $(shell pwd)/BackEnd start &
	npm --prefix $(shell pwd)/Front run dev &

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

aws-connect:
	ssh -i etc/aws-server.pem ubuntu@${AWS_SERVER}

aws-deploy:
	rsync 	-vrlt --progress \
		-e "ssh -i etc/aws-server.pem" \
		--files-from=etc/src \
		./ ubuntu@${AWS_SERVER}:/home/ubuntu/hackaton
	ssh -i "etc/aws-server.pem" ubuntu@${AWS_SERVER} < etc/cmd-install
	echo "http://${AWS_SERVER}:80"

aws-destroy:
	ssh -i "etc/aws-server.pem" ubuntu@${AWS_SERVER} < etc/cmd-uninstall

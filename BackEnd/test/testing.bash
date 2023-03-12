#!/bin/bash

URL=http://localhost:3000

echo "Iniciando sesion desde un usuario inexistente"
curl --verbose -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "usr=fake&pass=fake" $URL/usuarios/login
echo "Iniciando sesion con una contraseña erronea"
curl --verbose -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "usr=admin&pass=fake" $URL/usuarios/login
echo "Iniciando sesion con un usuario correcto"
curl --verbose -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "usr=admin&pass=admin" $URL/usuarios/login

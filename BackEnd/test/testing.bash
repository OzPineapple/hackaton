#!/bin/bash

set -x

URL=http://localhost:3000
VERBOSE=--verbose

appLoginAdmin(){
	curl \
		$VERBOSE \
		-X POST \
		-H "Content-Type: application/x-www-form-urlencoded" \
		-d "name=admin&password=admin" \
		$URL/login
}

appAdminGet(){
	curl \
		$VERBOSE \
		-X GET \
		-H "Authorization: Bearer $1" \
		$URL/admin/
}

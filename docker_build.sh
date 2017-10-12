#!/bin/bash

echo "Create self signed certificates"


domain=SelfSignedCert

if [[ ! -e ${domain}.cert ]]; then
  country=DE
  state=Bavaria
  locality=Munich
  organization=me
  email=john.doe@nowhere.com
  password=passw0rd

  openssl genrsa -des3 -passout pass:$password -out $domain.key 2048 -noout

  openssl rsa -in $domain.key -passin pass:$password -out $domain.key

  openssl req -new -key $domain.key -out $domain.csr -passin pass:$password \
      -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"


  openssl x509 -req -days 365 -in $domain.csr -signkey $domain.key -out $domain.cert
else
  echo "certificate found"
fi

echo "Check for proper configuration"

if [[ ! -e app/config-dev.js || ! -e app/config-prod.js ]]; then 
  echo "please create a valid configuration file 'config-dev.js', resp. 'config-prod.js' in the app subdirectory"
   
  echo "for the internal IBM sandbox environment, a valid configuration file (config-dev.js)"
  echo "can be downloaded from here: "
  echo "https://ibm.box.com/s/jzbf9agcw26oj4hiprjz99gcb27guaxw"

  exit -2;
fi

echo "Building docker image"

docker build -f Dockerfile.test -t iotidash .

echo "Done"

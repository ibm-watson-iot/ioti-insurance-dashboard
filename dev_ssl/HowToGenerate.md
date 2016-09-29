# How to generate TLS/SSH certificates

The TLS/SSL is a public/private key infrastructure (PKI). For most common cases, each client and server must have a *private key*.

The HTTPS server the dashboard creates uses an SSL public/private certificates.

### Generating a certificate

There are two kinds of certificates:
 - Signed by a *Certificate Authority*, refered also as `CA`. A Certificate Authority is a trusted source for an SSL certificate, using a certificate from `CA` allows your users to trust the identity of your site.
 - A *self-signed certificates*

The server requires a *private key*. One way for generating it is using  OpenSSL coomand line intergace to generate a 2048 bit RSA private key:


```sh
$ openssl genrsa -out server.key
```
Creating the *public key* is a two step process:

A. Generate a CSR for a private key, using OpenSSL:
```sh
 $ openssl req -new -sha256 -key server.key -out server-csr.pem
```
B. Once the cSR file is generated, it can either be sent to a Certifcate Authority for signing, or, used to generate a slef-signed Certifcate:
```sh
 $ openssl x509 -req -days 9999 -in server-csr.pem -signkey server.key -out server-cert.pem
```

Place these certificates under under directory  `./dev_ssl`.



For further details see [Node JS TLS documentation](https://nodejs.org/api/tls.html#tls_tls_ssl_concepts) or [Node JS HTTPS](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)

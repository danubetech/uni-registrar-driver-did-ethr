# Universal Registrar Driver: veramo

This is a [Universal Registrar](https://github.com/decentralized-identity/universal-registrar/) driver for identifiers supported by Veramo.

## Specifications

* [Decentralized Identifiers](https://w3c.github.io/did-core/)
* [Veramo](https://veramo.io/docs/)

## Build and Run (Docker)

```
docker build -f ./docker/Dockerfile . -t universalregistrar/danubetech-driver-veramo
docker run -p 9080:9080 universalregistrar/danubetech-driver-veramo
```

## Driver Environment Variables

* `(none)`

## Driver Input Options

```
{
    "keyType": "ed25519"
}
```

* `keyType`: The type of key to generate. Values: `ed25519`, `secp256k1`

## Driver Output Metadata

```
(none)
```

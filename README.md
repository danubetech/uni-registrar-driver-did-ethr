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

* `uniregistrar_driver_did_ethr_ethrEnabled`: Boolean flag whether to enable did:ethr.
* `uniregistrar_driver_did_ethr_ethrNetworks`: Semicolon-separated list of did:ethr networks.
* `uniregistrar_driver_did_ethr_ethrNetworkRpcUrls`: Semicolon-separated list of Ethereum RPC URLs.
* `uniregistrar_driver_did_ethr_ethrNetworkMetaPrivateKeys`: Semicolon-separated list of Ethereum private keys for meta transactions.
* `uniregistrar_driver_did_ethr_ethrNetworkMetaPublicKeys`: Semicolon-separated list of Ethereum public keys for meta-transactions.

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

# Universal Registrar Driver: did:ethr

This is a [Universal Registrar](https://github.com/decentralized-identity/universal-registrar/) driver for **did:ethr** identifiers.

## Specifications

* [Decentralized Identifiers](https://w3c.github.io/did-core/)
* [Veramo](https://veramo.io/docs/)

## Build and Run (Docker)

```
docker build -f ./docker/Dockerfile . -t universalregistrar/driver-did-ethr
docker run -p 9080:9080 universalregistrar/driver-did-ethr
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
    "network": "goerli"
}
```

* `network`: The network where the DID operation should take place. Values: `mainnet`, `goerli`, `sepolia`

## Driver Output Metadata

```
(none)
```

## About

Danube Tech - https://danubetech.com/

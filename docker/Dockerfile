# Dockerfile for universalregistrar/danubetech-driver-veramo

FROM node:18.9.0-alpine3.16
MAINTAINER Markus Sabadello <markus@danubetech.com>

# build danubetech-driver-veramo

WORKDIR /usr/src/app
COPY . .
RUN rm -rf node_modules/ && yarn

# variables

ENV uniregistrar_driver_veramo_ethrNetworks=mainnet;goerli;sepolia
ENV uniregistrar_driver_veramo_ethrNetworkRpcUrls=https://mainnet.infura.io/v3/ceaa1e1503234310b7b42dbad742a94d;https://goerli.infura.io/v3/ceaa1e1503234310b7b42dbad742a94d;https://sepolia.infura.io/v3/ceaa1e1503234310b7b42dbad742a94d
ENV uniregistrar_driver_veramo_cheqdCosmosPayerMnemonic=glory remain shrug expand feed they notice similar diagram acquire hour razor

# done

EXPOSE 9080
CMD [ "yarn", "ts-node", "index" ]

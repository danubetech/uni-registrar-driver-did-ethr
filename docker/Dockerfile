# Dockerfile for universalregistrar/driver-did-ethr

FROM node:18.9.0-alpine3.16
MAINTAINER Markus Sabadello <markus@danubetech.com>

# build driver-did-ethr

WORKDIR /usr/src/app
COPY . .
RUN rm -rf node_modules/

# variables

ENV uniregistrar_driver_did_ethr_ethrEnabled=true
ENV uniregistrar_driver_did_ethr_ethrNetworks=mainnet;goerli;sepolia
ENV uniregistrar_driver_did_ethr_ethrNetworkRpcUrls=https://mainnet.infura.io/v3/ceaa1e1503234310b7b42dbad742a94d;https://goerli.infura.io/v3/ceaa1e1503234310b7b42dbad742a94d;https://sepolia.infura.io/v3/ceaa1e1503234310b7b42dbad742a94d
ENV uniregistrar_driver_did_ethr_ethrNetworkMetaPrivateKeys=375ddac949bcf429c54adb9f362e836e3f3d38bdad8afe2d5ff1e65eb0a16a4d;375ddac949bcf429c54adb9f362e836e3f3d38bdad8afe2d5ff1e65eb0a16a4d;375ddac949bcf429c54adb9f362e836e3f3d38bdad8afe2d5ff1e65eb0a16a4d
ENV uniregistrar_driver_did_ethr_ethrNetworkMetaPublicKeys=02183982c76316812cb5567167cb3c5553b8d794041022b6a48ed86b3c6198ec6e;02183982c76316812cb5567167cb3c5553b8d794041022b6a48ed86b3c6198ec6e;02183982c76316812cb5567167cb3c5553b8d794041022b6a48ed86b3c6198ec6e

RUN yarn install
RUN yarn build

# done

EXPOSE 9080
CMD [ "yarn", "start" ]

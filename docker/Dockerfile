# Dockerfile for universalregistrar/danubetech-driver-veramo

FROM node:18.9.0-alpine3.16
MAINTAINER Markus Sabadello <markus@danubetech.com>

# build danubetech-driver-veramo

WORKDIR /usr/src/app
COPY . .
RUN rm -rf node_modules/
RUN yarn

# done

EXPOSE 9080

CMD [ "yarn", "ts-node", "index" ]

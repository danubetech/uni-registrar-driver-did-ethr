'use strict';

import { createTempAgent } from '../utils/agent';

import requestUtils from '../utils/requestUtils';
import responseUtils from '../utils/responseUtils';

export default {

    create: function(body: any, method: string) {

        const options = body.options;
        const didDocument = body.didDocument;
        return new Promise(function (resolve, reject) {
            try {
                const publicKeyHex = requestUtils.validateDidDocument(method, didDocument);
                if (! publicKeyHex) {
                    const response = responseUtils.actionGetVerificationMethodResponse(method);
                    resolve(response);
                    return null;
                }

                const methodOptions = requestUtils.methodOptions(method, options);
                const methodProvider = requestUtils.methodProvider(method, options);

                const agent = createTempAgent(methodProvider, publicKeyHex);
                console.log('trying to create DID with agent: ' + agent);
                agent.didManagerCreate({
                    alias: 'default',
                    provider: methodProvider,
                    options: methodOptions
                }).then((identifier: any) => {
                    console.log('successfully created DID: ' + JSON.stringify(identifier));
                    const did = identifier.did;
                    console.log("did: " + did);
                    const response = responseUtils.finishedResponse(method, did);
                    resolve(response);
                }).catch((e) => {
                    console.log('failed to create DID: ' + e.stack);
                    resolve({code: 500, payload: '' + e});
                });
            } catch (e) {
                console.log("ERROR: " + e);
                resolve({code: 500, payload: '' + e});
            }
        });
    },

    update: function(body: string, provider: string) {

        return new Promise(function (resolve, reject) {
            reject("Not implemented");
        });
    },

    deactivate: function(body: string, provider: string) {

        return new Promise(function (resolve, reject) {
            reject("Not implemented");
        });
    }
}
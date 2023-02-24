'use strict';

import { createTempAgent } from '../utils/agent.js';

import requestUtils from '../utils/requestUtils.js';
import responseUtils from '../utils/responseUtils.js';

export default {

    create: function(body: any, method: string) {

        const options = body.options;
        const didDocument = body.didDocument;
        return new Promise(async function (resolve, reject) {
            try {
                const publicKeyHex = requestUtils.validateDidDocument(method, didDocument);
                if (! publicKeyHex) {
                    const response = responseUtils.actionGetVerificationMethodResponse(method);
                    resolve(response);
                    return null;
                }

                const methodOptions = requestUtils.methodOptions(method, options);
                const methodProvider = requestUtils.methodProvider(method, options);

                const agent = await createTempAgent(methodProvider, publicKeyHex);
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
                }).catch((e: any) => {
                    console.log('failed to create DID: ' + e.stack);
                    resolve({code: 500, payload: '' + e});
                });
            } catch (e: any) {
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
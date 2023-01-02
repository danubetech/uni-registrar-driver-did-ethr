'use strict';

import { createTempAgent } from '../utils/agent';

import requestUtils from '../utils/requestUtils';
import responseUtils from '../utils/responseUtils';

export default {

    create: function(body: any, provider: string) {

        const options = body.options;
        const didDocument = body.didDocument;
        return new Promise(function (resolve, reject) {
            try {
                const publicKeyHex = requestUtils.validateDidDocument(provider, didDocument);
                if (! publicKeyHex) {
                    const response = responseUtils.actionGetVerificationMethodResponse(provider);
                    resolve(response);
                    return null;
                }

                const providerOptions = requestUtils.providerOptions(provider, options);

                const agent = createTempAgent(provider, publicKeyHex);
                agent.didManagerCreate({
                    alias: 'default',
                    provider: provider,
                    options: providerOptions
                }).then((identifier: any) => {
                    console.log(`identifier: ` + JSON.stringify(identifier, null, 2));
                    const did = identifier.did;
                    console.log("did: " + did);
                    const response = responseUtils.finishedResponse(provider, did);
                    resolve(response);
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
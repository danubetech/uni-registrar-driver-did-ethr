'use strict';

import { agent } from '../utils/agent';

import responseUtils from '../utils/responseUtils';

export default {
    /**
     * Creates a DID.
     *
     * body CreateRequest  (optional)
     * returns CreateState
     **/
    create: function(body: any, provider: string) {
        const options = body.options;
        const didDocument = body.didDocument;
        return new Promise(function (resolve, reject) {
            try {
                agent.didManagerCreate({
                    alias: 'default',
                    provider: provider,
                    options: options
                }).then((identifier: any) => {
                    console.log(`identifier: ` + JSON.stringify(identifier, null, 2));
                    const did = identifier.did;
                    console.log("did: " + did);
                    const response = responseUtils.finishedResponse(did);
                    resolve(response);
                });

                /*            if (! didDocument || ! didDocument.verificationMethod) {
                    let optionType = options ? options.keyType : null;
                    if (! optionType) optionType = "Ed25519";

                    const response = verificationMethodUtils.actionGetVerificationMethodResponse(optionType);
                    resolve(response);
                    return;
                }
                if (didDocument.verificationMethod.length !== 1) throw "DID document must have exactly one verification method.";
                if ("JsonWebKey2020" !== didDocument.verificationMethod[0].type) throw "Verification method must be of type 'JsonWebKey2020'";
                if (! didDocument.verificationMethod[0].publicKeyJwk) throw "Verification method must have property 'publicKeyJwk'";

                const jwk = didDocument.verificationMethod[0].publicKeyJwk;
                console.log("jwk: " + JSON.stringify(jwk));
                const keyTypeInstance = keyTypeInstanceUtils.keyTypeInstanceForJwk(jwk);
                console.log("keyTypeInstance: " + keyTypeInstance);
                const verificationMethod = {
                    "type": "JsonWebKey2020",
                    "publicKeyJwk" : jwk
                };
                console.log("verificationMethod: " + JSON.stringify(verificationMethod));
                keyTypeInstance.fingerprintFromPublicKey(verificationMethod).then((fingerprint) => {
                    const did = "did:key:" + fingerprint;
                    console.log("did: " + did);
                    const didUrl = did + "#" + fingerprint;
                    console.log("didUrl: " + didUrl);
                    const response = verificationMethodUtils.finishedResponse(did, didUrl);
                    resolve(response);
                }).catch((e) => {
                    console.log("ERROR: " + e);
                    resolve({code: 500, payload: '' + e});
                });*/
            } catch (e) {
                console.log("ERROR: " + e);
                resolve({code: 500, payload: '' + e});
            }
        });
    },

    /**
     * Updates a DID.
     *
     * body UpdateRequest  (optional)
     * returns UpdateState
     **/
    update: function(body: string, provider: string) {
        return new Promise(function (resolve, reject) {
            reject("Not implemented");
        });
    },

    /**
     * Deactivates a DID.
     *
     * body DeactivateRequest  (optional)
     * returns DeactivateState
     **/
    deactivate: function(body: string, provider: string) {
        return new Promise(function (resolve, reject) {
            reject("Not implemented");
        });
    }
}
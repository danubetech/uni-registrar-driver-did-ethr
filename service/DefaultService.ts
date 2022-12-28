'use strict';

import { agent } from '../utils/agent';

import verificationMethodUtils from '../utils/verificationMethodUtils';

export default {
    /**
     * Creates a DID.
     *
     * body CreateRequest  (optional)
     * returns CreateState
     **/
    create: function(body: any) {
        const options = body.options;
        const didDocument = body.didDocument;
        return new Promise(function (resolve, reject) {
            try {
                console.log(typeof agent);
                console.log(typeof agent.didManagerCreate);
                agent.didManagerCreate({alias: 'default'}).then((identifier: any) => {
                    console.log(`New identifier created`);
                    console.log(JSON.stringify(identifier, null, 2));
                    const did = "did:test:test";
                    console.log("did: " + did);
                    const didUrl = did + "#" + "test";
                    console.log("didUrl: " + didUrl);
                    const response = verificationMethodUtils.finishedResponse(did, didUrl);
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
    update: function(body: string) {
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
    deactivate: function(body: string) {
        return new Promise(function (resolve, reject) {
            reject("Not implemented");
        });
    }
}
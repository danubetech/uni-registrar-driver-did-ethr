
export default {

    actionGetVerificationMethodResponse: function(method: string) {

        if ('did:ethr' === method) {
            return {
                "jobId": null,
                "didState": {
                    "state": "action",
                    "action": "getVerificationMethod",
                    "verificationMethodTemplate": [{
                        "id": "#controllerKey",
                        "type": "EcdsaSecp256k1VerificationKey2019"
                    }]
                }
            };
        } else if ('did:pkh' === method) {
            return {
                "jobId": null,
                "didState": {
                    "state": "action",
                    "action": "getVerificationMethod",
                    "verificationMethodTemplate": [{
                        "id": "#blockchainAccountIdKey",
                        "type": "EcdsaSecp256k1VerificationKey2019"
                    }]
                }
            };
        } else if ('did:cheqd' === method) {
            return {
                "jobId": null,
                "didState": {
                    "state": "action",
                    "action": "getVerificationMethod",
                    "verificationMethodTemplate": [{
                        "id": "#key1",
                        "type": "Ed25519VerificationKey2020"
                    }]
                }
            };
        } else {
            throw 'Unsupported method (actionGetVerificationMethodResponse): ' + method;
        }
    },

    signingRequest: function(method: string, kid?: string, alg?: string, serializedPayload?: Uint8Array) {

        if ('did:ethr' === method) {
            let signingRequest: any = {};
            if (kid) signingRequest['kid'] = kid;
            if (alg) signingRequest['alg'] = 'ES256KCC';
            if (serializedPayload) signingRequest['serializedPayload'] = [...serializedPayload].map(x => x.toString(16).padStart(2, '0')).join('');
            return signingRequest;
        } else {
            throw 'Unsupported method (signingRequest): ' + method;
        }
    },

    actionSignPayloadResponse: function(method: string, signingRequestSet: any) {

        if ('did:ethr' === method) {
            return {
                "jobId": null,
                "didState": {
                    "state": "action",
                    "action": "signPayload",
                    "signingRequest": signingRequestSet
                }
            };
        } else {
            throw 'Unsupported method (actionSignPayloadResponse): ' + method;
        }
    },

    finishedResponse: function(method: string, did: string) {

        if ('did:ethr' === method) {
            return {
                "jobId": null,
                "didState": {
                    "did": did,
                    "state": "finished",
                    "secret": {
                        "verificationMethod": [
                            [{
                                "id": "#controllerKey",
                                "type": "EcdsaSecp256k1VerificationKey2019"
                            }, {
                                "id": did + "#controllerKey",
                                "controller": did,
                                "purpose": ["authentication", "assertionMethod"]
                            }]
                        ]
                    }
                }
            };
        } else if ('did:pkh' === method) {
            return {
                "jobId": null,
                "didState": {
                    "did": did,
                    "state": "finished",
                    "secret": {
                        "verificationMethod": [
                            [{
                                "id": "#blockchainAccountIdKey",
                                "type": "EcdsaSecp256k1VerificationKey2019"
                            }, {
                                "id": did + "#blockchainAccountIdKey",
                                "controller": did,
                                "purpose": ["authentication", "assertionMethod"]
                            }]
                        ]
                    }
                }
            };
        } else {
            throw 'Unsupported method (finishedResponse): ' + method;
        }
    }
}
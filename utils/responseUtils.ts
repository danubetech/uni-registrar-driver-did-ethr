
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
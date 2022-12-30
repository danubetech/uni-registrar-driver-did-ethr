
export default {

    actionGetVerificationMethodResponse: function(provider: string) {

        if ('did:ethr' === provider) {
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
        } else if ('did:pkh' === provider) {
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
        } else if ('did:cheqd' === provider) {
            return {
                "jobId": null,
                "didState": {
                    "state": "action",
                    "action": "getVerificationMethod",
                    "verificationMethodTemplate": [{
                        "type": "Ed25519VerificationKey2018"
                    }]
                }
            };
        } else {
            throw 'Unsupported provider (actionGetVerificationMethodResponse): ' + provider;
        }
    },

    finishedResponse: function(provider: string, did: string) {

        if ('did:ethr' === provider) {
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
        } else if ('did:pkh' === provider) {
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
            throw 'Unsupported provider (finishedResponse): ' + provider;
        }
    }
}

export default {
    actionGetVerificationMethodResponse: function(type: string) {
        const publicKeyJwkTemplate = this.publicKeyJwkTemplateForType(type);
        console.log("publicKeyJwkTemplate for type " + type + ": " + JSON.stringify(publicKeyJwkTemplate));
        return {
            "jobId": null,
            "didState": {
                "state": "action",
                "action": "getVerificationMethod",
                "verificationMethodTemplate": [{
                    "id": "#temp",
                    "type": "JsonWebKey2020",
                    "purpose": ["authentication"],
                    "publicKeyJwk": publicKeyJwkTemplate
                }]
            }
        };
    },

    finishedResponse: function(did: string) {
        return {
            "jobId": null,
            "didState": {
                "did": did,
                "state": "finished"
            }
        };
    },

    publicKeyJwkTemplateForType: function(type: string) {
        if (type) type = type.toLowerCase();
        switch(type) {
            case 'rsa':
                return {
                    "kty": "RSA"
                };
            case 'secp256k1':
                return {
                    "kty": "EC",
                    "crv": "secp256k1"
                };
            case 'bls12381g1':
                return {
                    "kty": "OKP",
                    "crv": "Bls12381G1"
                };
            case 'bls12381g2':
                return {
                    "kty": "OKP",
                    "crv": "Bls12381G2"
                };
            case 'bls48581g1':
                return {
                    "kty": "OKP",
                    "crv": "Bls48581G1"
                };
            case 'bls48581g2':
                return {
                    "kty": "OKP",
                    "crv": "Bls48581G2"
                };
            case 'ed25519':
                return {
                    "kty": "OKP",
                    "crv": "Ed25519"
                };
            case 'x25519':
                return {
                    "kty": "OKP",
                    "crv": "X25519"
                };
            case 'p-256':
                return {
                    "kty": "EC",
                    "crv": "P-256"
                };
            case 'p-384':
                return {
                    "kty": "EC",
                    "crv": "P-384"
                };
            case 'p-521':
                return {
                    "kty": "EC",
                    "crv": "P-521"
                };
            default:
                throw "Unknown key type: " + type;
        }
    }
}
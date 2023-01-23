
export default {

    validateDidDocument: function(method: string, didDocument: any): string | null {

        if (! didDocument?.verificationMethod) return null;

        var publicKeyHex;

        if ('did:ethr' === method) {
            if ("#controllerKey" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#controllerKey'.";
            if ("EcdsaSecp256k1VerificationKey2019" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'EcdsaSecp256k1VerificationKey2019'";
            if (! didDocument.verificationMethod[0].publicKeyHex) throw "Verification method must have property 'publicKeyHex'";
            publicKeyHex = didDocument.verificationMethod[0].publicKeyHex;
        } else if ('did:pkh' === method) {
            if ("#blockchainAccountIdKey" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#blockchainAccountIdKey'.";
            if ("EcdsaSecp256k1VerificationKey2019" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'EcdsaSecp256k1VerificationKey2019'";
            if (! didDocument.verificationMethod[0].publicKeyHex) throw "Verification method must have property 'publicKeyHex'";
            publicKeyHex = didDocument.verificationMethod[0].publicKeyHex;
        } else if ('did:cheqd' === method) {
            if ("#key1" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#key1'.";
            if ("Ed25519VerificationKey2020" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'Ed25519VerificationKey2020'";
            if (! didDocument.verificationMethod[0].publicKeyMultibase) throw "Verification method must have property 'publicKeyMultibase'";
            publicKeyHex = didDocument.verificationMethod[0].publicKeyMultibase;
        } else {
            throw 'Unsupported method (validateDidDocument): ' + method;
        }

        console.log('publicKeyHex: ' + JSON.stringify(publicKeyHex));
        return publicKeyHex;
    },

    methodOptions: function(method: string, options: any): any {

        var methodOptions;

        if ('did:ethr' === method) {
            methodOptions = { ...options };
        } else if ('did:pkh' === method) {
            methodOptions = { ...options };
            if (! options.chainId && options.network) {
                methodOptions['chainId'] = methodOptions['network'];
            }
        } else if ('did:cheqd' === method) {
            methodOptions = { ...options };
        } else {
            throw 'Unsupported method (methodOptions): ' + method;
        }

        console.log('methodOptions: ' + JSON.stringify(methodOptions));
        return methodOptions;
    },

    methodProvider: function(method: string, options: any): any {

        var methodProvider;

        if ('did:ethr' === method) {
            methodProvider = 'did:ethr';
        } else if ('did:pkh' === method) {
            methodProvider = 'did:pkh';
        } else if ('did:cheqd' === method) {
            if (options.network) {
                methodProvider = 'did:cheqd:' + options.network;
            } else {
                methodProvider = 'did:cheqd';
            }
        } else {
            throw 'Unsupported method (methodProvider): ' + method;
        }

        console.log('methodProvider: ' + methodProvider);
        return methodProvider;
    }
}
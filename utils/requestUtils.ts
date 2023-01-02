
export default {

    validateDidDocument: function(provider: string, didDocument: any): string | null {

        if (! didDocument?.verificationMethod) {
            return null;
        }
        if ('did:ethr' === provider) {
            if ("#controllerKey" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#controllerKey'.";
            if ("EcdsaSecp256k1VerificationKey2019" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'EcdsaSecp256k1VerificationKey2019'";
            if (! didDocument.verificationMethod[0].publicKeyHex) throw "Verification method must have property 'publicKeyHex'";
            return didDocument.verificationMethod[0].publicKeyHex;
        } else if ('did:pkh' === provider) {
            if ("#blockchainAccountIdKey" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#blockchainAccountIdKey'.";
            if ("EcdsaSecp256k1VerificationKey2019" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'EcdsaSecp256k1VerificationKey2019'";
            if (! didDocument.verificationMethod[0].publicKeyHex) throw "Verification method must have property 'publicKeyHex'";
            return didDocument.verificationMethod[0].publicKeyHex;
        } else if ('did:cheqd' === provider) {
            if ("#key1" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#key1'.";
            if ("Ed25519VerificationKey2020" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'Ed25519VerificationKey2020'";
            if (! didDocument.verificationMethod[0].publicKeyMultibase) throw "Verification method must have property 'publicKeyMultibase'";
            return didDocument.verificationMethod[0].publicKeyMultibase;
        } else {
            throw 'Unsupported provider (validateDidDocument): ' + provider;
        }
    },

    providerOptions: function(provider: string, options: any): any {

        if ('did:ethr' === provider) {
            const providerOptions = { ...options };
            return providerOptions;
        } else if ('did:pkh' === provider) {
            if (! options.chainId && options.network) {
                const providerOptions = { ...options };
                providerOptions['chainId'] = providerOptions['network'];
                return providerOptions;
            }
            return options;
        } else if ('did:cheqd' === provider) {
            const providerOptions = { ...options };
            return providerOptions;
        } else {
            throw 'Unsupported provider (providerOptions): ' + provider;
        }
    }
}

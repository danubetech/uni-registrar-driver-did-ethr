
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
            if ("#controllerKey" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#controllerKey'.";
            if ("EcdsaSecp256k1VerificationKey2019" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'EcdsaSecp256k1VerificationKey2019'";
            if (! didDocument.verificationMethod[0].publicKeyHex) throw "Verification method must have property 'publicKeyHex'";
            return didDocument.verificationMethod[0].publicKeyHex;
        } else if ('did:cheqd' === provider) {
            if ("#controllerKey" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#controllerKey'.";
            if ("EcdsaSecp256k1VerificationKey2019" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'EcdsaSecp256k1VerificationKey2019'";
            if (! didDocument.verificationMethod[0].publicKeyHex) throw "Verification method must have property 'publicKeyHex'";
            return didDocument.verificationMethod[0].publicKeyHex;
        } else {
            throw 'Unsupported provider (validateDidDocument): ' + provider;
        }
    }
}

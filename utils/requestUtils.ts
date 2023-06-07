
export default {

    determineMethodPublicKeyHex: function(method: string, didDocument: any): string | null {

        if (! didDocument?.verificationMethod) return null;

        var publicKeyHex;

        if ('did:ethr' === method) {
            if ("#controllerKey" !== didDocument?.verificationMethod[0]?.id) throw "DID document must have exactly one verification method with id '#controllerKey'.";
            if ("EcdsaSecp256k1VerificationKey2019" !== didDocument?.verificationMethod[0]?.type) throw "Verification method must be of type 'EcdsaSecp256k1VerificationKey2019'";
            if (! didDocument.verificationMethod[0].publicKeyHex) throw "Verification method must have property 'publicKeyHex'";
            publicKeyHex = didDocument.verificationMethod[0].publicKeyHex;
        } else {
            throw 'Unsupported method (validateDidDocument): ' + method;
        }

        console.log('publicKeyHex: ' + JSON.stringify(publicKeyHex));
        return publicKeyHex;
    },

    determineMethodOptions: function(method: string, operation: string, options: any): any {

        var methodOptions: any;

        if ('did:ethr' === method) {
            methodOptions = { };
            if ('create' === operation) {
                if (options.network) {
                    methodOptions['network'] = options['network'];
                }
            }
            methodOptions['metaIdentifierKeyId'] = 'metakey';
        } else {
            throw 'Unsupported method (methodOptions): ' + method;
        }

        console.log('methodOptions: ' + JSON.stringify(methodOptions));
        return methodOptions;
    },
}

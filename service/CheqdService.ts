'use strict';

import {IKey, IService, IServiceEndpoint} from "@veramo/core";

import {createCheqdAgent} from "../utils/cheqdAgent.js";

import requestUtils from '../utils/requestUtils.js';
import responseUtils from '../utils/responseUtils.js';

export default {

    create: function(body: any, method: string) {

        const options = body.options;
        const didDocument = body.didDocument;

        return new Promise(async function (resolve, reject) {
            try {
                const methodPublicKeyHex = requestUtils.determineMethodPublicKeyHex(method, didDocument);
                if (! methodPublicKeyHex) {
                    const response = responseUtils.actionGetVerificationMethodResponse(method);
                    resolve(response);
                    return;
                }

                const methodOptions = requestUtils.determineMethodOptions(method, options);
                const methodNetwork = determineMethodNetwork(options);

                const { agent } = await createCheqdAgent('create', methodPublicKeyHex, methodNetwork);
                console.log('trying to create DID with agent: ' + agent);
                await agent.didManagerCreate({
                    alias: 'default',
                    options: methodOptions
                }).then((identifier: any) => {
                    console.log('successfully created DID: ' + JSON.stringify(identifier));
                    const did = identifier.did;
                    console.log("did: " + did);
                    const response = responseUtils.finishedResponse(method, did);
                    resolve(response);
                    return;
                }).catch((e: any) => {
                    console.log('failed to create DID: ' + e.stack);
                    resolve({code: 500, payload: '' + e});
                    return;
                });
            } catch (e: any) {
                console.log("ERROR: " + e);
                resolve({code: 500, payload: '' + e});
                return;
            }
        });
    },

    update: function(body: any, method: string) {

        const did = body.did;
        const options = body.options;
        const didDocumentOperations = body.didDocumentOperation;
        const didDocuments = body.didDocument;

        return new Promise(async function (resolve, reject) {
            try {
                const methodOptions = requestUtils.determineMethodOptions(method, options);
                const methodNetwork = determineMethodNetwork(options);

                const { agent } = await createCheqdAgent('update', '', methodNetwork);
                console.log('trying to update DID ' + did + ' with operations ' + JSON.stringify(didDocumentOperations) + ' with agent: ' + agent);

                for (const i in didDocumentOperations) {
                    const didDocumentOperation = didDocumentOperations[i];
                    const didDocument = didDocuments[i];
                    console.log('didDocumentOperation: ' + didDocumentOperation);
                    console.log('didDocument: ' + JSON.stringify(didDocument));
                    if (didDocumentOperation === 'addToDidDocument') {
                        if (Array.isArray(didDocument.verificationMethod)) for (const didDocumentVerificationMethod of didDocument.verificationMethod) {
                            console.log('didDocumentVerificationMethod: ' + JSON.stringify(didDocumentVerificationMethod));
                            let key: IKey = {
                                kid: didDocumentVerificationMethod.id,
                                kms: 'local',
                                type: didDocumentVerificationMethod.type,
                                publicKeyHex: didDocumentVerificationMethod.publicKeyHex
                            }
                            console.log('trying to add key: ' + JSON.stringify(key));
                            await agent.didManagerAddKey({
                                did: did,
                                key: key,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully added key to DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                console.log('failed to add key to DID: ' + e.stack);
                                resolve({code: 500, payload: '' + e});
                                return;
                            });
                        }
                        if (Array.isArray(didDocument.service)) for (const didDocumentService of didDocument.service) {
                            console.log('didDocumentService: ' + JSON.stringify(didDocumentService));
                            let didDocumentServiceEndpoint: IServiceEndpoint = didDocumentService.serviceEndpoint;
                            let service: IService = {
                                id: didDocumentService.id,
                                type: didDocumentService.type,
                                serviceEndpoint: didDocumentServiceEndpoint
                            }
                            console.log('trying to add service: ' + JSON.stringify(service));
                            await agent.didManagerAddService({
                                did: did,
                                service: service,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully added service to DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                console.log('failed to add service to DID: ' + e.stack);
                                resolve({code: 500, payload: '' + e});
                                return;
                            });
                        }
                    } else if (didDocumentOperation === 'removeFromDidDocument') {
                        throw "Missing or unsupported didDocumentOperation: " + didDocumentOperation;
                    } else {
                        throw "Missing or unsupported didDocumentOperation: " + didDocumentOperation;
                    }
                }

                const response = responseUtils.finishedResponse(method, did);
                resolve(response);
                return;
            } catch (e: any) {
                console.log("ERROR: " + e);
                resolve({code: 500, payload: '' + e});
                return;
            }
        });
    },

    deactivate: function(body: any, method: string) {

        return new Promise(function (resolve, reject) {
            reject("Not implemented");
        });
    }
}

const determineMethodNetwork = function(options: any): any {

    let methodNetwork = options.network;

    console.log('methodNetwork: ' + methodNetwork);
    return methodNetwork;
}

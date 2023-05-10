'use strict';

import {IKey, IService, IServiceEndpoint} from "@veramo/core";

import {createEthrAgent} from '../utils/ethrAgent.js';

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
                    const actionGetVerificationMethod = responseUtils.actionGetVerificationMethodResponse(method);
                    resolve(actionGetVerificationMethod);
                    return;
                }

                const methodOptions = requestUtils.determineMethodOptions(method, 'create', options);
                const methodNetwork = determineMethodNetwork(options);

                const { agent } = await createEthrAgent('create', methodNetwork, methodPublicKeyHex);
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
        const signingResponseSet = body.secret?.signingResponse;

        return new Promise(async function (resolve, reject) {
            try {
                const methodOptions = requestUtils.determineMethodOptions(method, 'update', options);
                const methodNetwork = determineMethodNetwork(options);

                const { keyManagementSystem, agent } = await createEthrAgent('update', methodNetwork, undefined);
                console.log('trying to update DID ' + did + ' with operations ' + JSON.stringify(didDocumentOperations) + ' with agent: ' + agent);

                let signingRequestSet: any = {};

                for (const i in didDocumentOperations) {
                    const didDocumentOperation = didDocumentOperations[i];
                    const didDocument = didDocuments[i];
                    console.log('didDocumentOperation: ' + didDocumentOperation);
                    console.log('didDocument: ' + JSON.stringify(didDocument));

                    if (didDocumentOperation === 'addToDidDocument') {

                        /*
                         * addToDidDocument - verificationMethod
                         */

                        if (Array.isArray(didDocument.verificationMethod)) for (const ii in didDocument.verificationMethod) {
                            const didDocumentVerificationMethod = didDocument.verificationMethod[ii];
                            console.log('didDocumentVerificationMethod: ' + JSON.stringify(didDocumentVerificationMethod));

                            const signingRequestId = 'signingRequestV' + ii;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }

                            let key: IKey = {
                                kid: didDocumentVerificationMethod.id,
                                kms: 'local',
                                type: didDocumentVerificationMethod.type,
                                publicKeyHex: didDocumentVerificationMethod.publicKeyHex
                            }

                            console.log('trying to add key to DID ' + did + ' with options ' + JSON.stringify(options) + ': ' + JSON.stringify(key));
                            await agent.didManagerAddKey({
                                did: did,
                                key: key,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully added key to DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                if (e.reason?.includes('signature missing') && ! signingResponse) {
                                    const signingRequest = responseUtils.signingRequest(method, keyManagementSystem.signKid, keyManagementSystem.signAlgorithm, keyManagementSystem.signData);
                                    signingRequestSet[signingRequestId] = signingRequest;
                                    console.log('created signing request ' + signingRequestId + ': ' + JSON.stringify(signingRequest));
                                    return;
                                }
                                console.log('failed to add key to DID: ' + e.stack);
                                resolve({code: 500, payload: '' + e});
                                return;
                            });
                        }

                        /*
                         * addToDidDocument - service
                         */

                        if (Array.isArray(didDocument.service)) for (const ii in didDocument.service) {
                            const didDocumentService = didDocument.service[ii];
                            console.log('didDocumentService: ' + JSON.stringify(didDocumentService));

                            const signingRequestId = 'signingRequestS' + ii;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }

                            let didDocumentServiceEndpoint: IServiceEndpoint = didDocumentService.serviceEndpoint;
                            let service: IService = {
                                id: didDocumentService.id,
                                type: didDocumentService.type,
                                serviceEndpoint: didDocumentServiceEndpoint
                            }

                            console.log('trying to add service to DID ' + did + ' with options ' + JSON.stringify(options) + ': ' + JSON.stringify(service));
                            await agent.didManagerAddService({
                                did: did,
                                service: service,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully added service to DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                if (e.reason?.includes('signature missing') && ! signingResponse) {
                                    const signingRequest = responseUtils.signingRequest(method, keyManagementSystem.signKid, keyManagementSystem.signAlgorithm, keyManagementSystem.signData);
                                    signingRequestSet[signingRequestId] = signingRequest;
                                    console.log('created signing request ' + signingRequestId + ': ' + JSON.stringify(signingRequest));
                                    return;
                                }
                                console.log('failed to add service to DID: ' + e.stack);
                                resolve({code: 500, payload: '' + e});
                                return;
                            });
                        }
                    } else if (didDocumentOperation === 'removeFromDidDocument') {

                        /*
                         * removeFromDidDocument - verificationMethod
                         */

                        if (Array.isArray(didDocument.verificationMethod)) for (const ii in didDocument.verificationMethod) {
                            const didDocumentVerificationMethod = didDocument.verificationMethod[ii];
                            console.log('didDocumentVerificationMethod: ' + JSON.stringify(didDocumentVerificationMethod));

                            const signingRequestId = 'signingRequestV' + ii;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }

                            let id: string = didDocumentVerificationMethod.id;

                            console.log('trying to remove key from DID ' + did + ' with options ' + JSON.stringify(options) + ': ' + id);
                            await agent.didManagerRemoveKey({
                                did: did,
                                kid: id,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully removed key from DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                if (e.reason?.includes('signature missing') && ! signingResponse) {
                                    const signingRequest = responseUtils.signingRequest(method, keyManagementSystem.signKid, keyManagementSystem.signAlgorithm, keyManagementSystem.signData);
                                    signingRequestSet[signingRequestId] = signingRequest;
                                    console.log('created signing request ' + signingRequestId + ': ' + JSON.stringify(signingRequest));
                                    return;
                                }
                                console.log('failed to remove key from DID: ' + e.stack);
                                resolve({code: 500, payload: '' + e});
                                return;
                            });
                        }

                        /*
                         * removeFromDidDocument - service
                         */

                        if (Array.isArray(didDocument.service)) for (const ii in didDocument.service) {
                            const didDocumentService = didDocument.service[ii];
                            console.log('didDocumentService: ' + JSON.stringify(didDocumentService));

                            const signingRequestId = 'signingRequestS' + ii;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }

                            let id: string = didDocumentService.id;

                            console.log('trying to remove service from DID ' + did + ' with options ' + JSON.stringify(options) + ': ' + id);
                            await agent.didManagerRemoveService({
                                did: did,
                                id: id,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully removed service to DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                if (e.reason?.includes('signature missing') && ! signingResponse) {
                                    const signingRequest = responseUtils.signingRequest(method, keyManagementSystem.signKid, keyManagementSystem.signAlgorithm, keyManagementSystem.signData);
                                    signingRequestSet[signingRequestId] = signingRequest;
                                    console.log('created signing request ' + signingRequestId + ': ' + JSON.stringify(signingRequest));
                                    return;
                                }
                                console.log('failed to remove service from DID: ' + e.stack);
                                resolve({code: 500, payload: '' + e});
                                return;
                            });
                        }
                    } else {
                        throw "Missing or unsupported didDocumentOperation: " + didDocumentOperation;
                    }
                }

                if (Object.keys(signingRequestSet).length > 0) {
                    const actionSignPayload = responseUtils.actionSignPayloadResponse(method, signingRequestSet);
                    resolve(actionSignPayload);
                    return;
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

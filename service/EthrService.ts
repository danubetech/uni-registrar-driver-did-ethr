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

                const methodOptions = requestUtils.determineMethodOptions(method, options);

                const { agent } = await createEthrAgent('create', methodPublicKeyHex, undefined);
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
                const methodOptions = requestUtils.determineMethodOptions(method, options);

                const { keyManagementSystem, agent } = await createEthrAgent('update', undefined, signingResponseSet);
                console.log('trying to update DID ' + did + ' with operations ' + JSON.stringify(didDocumentOperations) + ' with agent: ' + agent);

                let signingRequestSet: any = {};

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
                            const signingRequestId = 'signingRequestV' + i;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }
                            console.log('trying to add key to did ' + did + ' with options ' + JSON.stringify(options) + ': ' + JSON.stringify(key));
                            await agent.didManagerAddKey({
                                did: did,
                                key: key,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully added key to DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                if (e.reason.includes('signature missing') && ! signingResponse) {
                                    const signingRequest = responseUtils.signingRequest(method, keyManagementSystem.signKid, keyManagementSystem.signAlgorithm, keyManagementSystem.signData);
                                    signingRequestSet[signingRequestId] = signingRequest;
                                    console.log('added signing request ' + signingRequestId + ': ' + JSON.stringify(signingRequest));
                                    return;
                                }
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
                            const signingRequestId = 'signingRequestS' + i;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }
                            console.log('trying to add service to did ' + did + ' with options ' + JSON.stringify(options) + ': ' + JSON.stringify(service));
                            await agent.didManagerAddService({
                                did: did,
                                service: service,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully added service to DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                if (e.reason.includes('signature missing') && ! signingResponse) {
                                    const signingRequest = responseUtils.signingRequest(method, keyManagementSystem.signKid, keyManagementSystem.signAlgorithm, keyManagementSystem.signData);
                                    signingRequestSet[signingRequestId] = signingRequest;
                                    console.log('added signing request ' + signingRequestId + ': ' + JSON.stringify(signingRequest));
                                    return;
                                }
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
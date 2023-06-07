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
                const methodNetwork = determineMethodNetworkByOptions(options);

                const { agent } = await createEthrAgent('create', methodNetwork, methodPublicKeyHex);
                console.log('trying to create DID with agent: ' + agent);

                let promises = [];

                promises.push(agent.didManagerCreate({
                    alias: 'default',
                    options: methodOptions
                }).then((identifier: any) => {
                    console.log('successfully created DID: ' + JSON.stringify(identifier));
                    const did = identifier.did;
                    console.log("did: " + did);
                    const response = responseUtils.finishedResponse(method, did);
                    return response;
                }).catch((e: any) => {
                    console.log('failed to create DID: ' + e.stack);
                    return {code: 500, payload: '' + e};
                }));

                const promisesResults = (await Promise.all(promises)).filter(e => e);
                console.log('results: ' + JSON.stringify(promisesResults));
                if (promisesResults.length > 0) {
                    resolve(promisesResults[0]);
                    return;
                }
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
                const methodNetwork = determineMethodNetworkByDid(did);

                console.log('trying to update DID ' + did + ' with options ' + JSON.stringify(methodOptions) + ' with operations ' + JSON.stringify(didDocumentOperations));

                let promises = [];
                let signingRequestSet: any = {};

                for (const i in didDocumentOperations) {
                    const didDocumentOperation = didDocumentOperations[i];
                    const didDocument = didDocuments[i];
                    console.log('didDocumentOperation ' + i + ': ' + didDocumentOperation);
                    console.log('didDocument ' + i + ': ' + JSON.stringify(didDocument));

                    if (didDocumentOperation === 'addToDidDocument') {

                        /*
                         * addToDidDocument - verificationMethod
                         */

                        if (Array.isArray(didDocument.verificationMethod)) for (const ii in didDocument.verificationMethod) {
                            const didDocumentVerificationMethod = didDocument.verificationMethod[ii];
                            console.log('didDocumentVerificationMethod: ' + JSON.stringify(didDocumentVerificationMethod));

                            const { didStore, keyManagementSystem, agent } = await createEthrAgent('update', methodNetwork, undefined);
                            didStore.didDocument = { };

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
                            promises.push(agent.didManagerAddKey({
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
                                return {code: 500, payload: '' + e};
                            }));
                        }

                        /*
                         * addToDidDocument - service
                         */

                        if (Array.isArray(didDocument.service)) for (const ii in didDocument.service) {
                            const didDocumentService = didDocument.service[ii];
                            console.log('didDocumentService: ' + JSON.stringify(didDocumentService));

                            const { didStore, keyManagementSystem, agent } = await createEthrAgent('update', methodNetwork, undefined);
                            didStore.didDocument = { };

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
                            promises.push(agent.didManagerAddService({
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
                                return {code: 500, payload: '' + e};
                            }));
                        }
                    } else if (didDocumentOperation === 'removeFromDidDocument') {

                        /*
                         * removeFromDidDocument - verificationMethod
                         */

                        if (Array.isArray(didDocument.verificationMethod)) for (const ii in didDocument.verificationMethod) {
                            const didDocumentVerificationMethod = didDocument.verificationMethod[ii];
                            console.log('didDocumentVerificationMethod: ' + JSON.stringify(didDocumentVerificationMethod));

                            const { didStore, keyManagementSystem, agent } = await createEthrAgent('update', methodNetwork, undefined);
                            didStore.didDocument = didDocument;

                            const signingRequestId = 'signingRequestV' + ii;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }

                            let id: string = didDocumentVerificationMethod.id;

                            console.log('trying to remove key from DID ' + did + ' with options ' + JSON.stringify(options) + ': ' + id);
                            promises.push(agent.didManagerRemoveKey({
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
                                return {code: 500, payload: '' + e};
                            }));
                        }

                        /*
                         * removeFromDidDocument - service
                         */

                        if (Array.isArray(didDocument.service)) for (const ii in didDocument.service) {
                            const didDocumentService = didDocument.service[ii];
                            console.log('didDocumentService: ' + JSON.stringify(didDocumentService));

                            const { didStore, keyManagementSystem, agent } = await createEthrAgent('update', methodNetwork, undefined);
                            didStore.didDocument = didDocument;

                            const signingRequestId = 'signingRequestS' + ii;
                            const signingResponse = signingResponseSet?.[signingRequestId];
                            console.log('found signing response ' + signingRequestId + ': ' + JSON.stringify(signingResponse));
                            if (signingResponse?.signature) {
                                keyManagementSystem.signResponse = Buffer.from(signingResponse.signature, 'base64');
                            }

                            let id: string = didDocumentService.id;

                            console.log('trying to remove service from DID ' + did + ' with options ' + JSON.stringify(options) + ': ' + id);
                            promises.push(agent.didManagerRemoveService({
                                did: did,
                                id: id,
                                options: methodOptions
                            }).then((identifier: any) => {
                                console.log('successfully removed service from DID: ' + JSON.stringify(identifier));
                            }).catch((e: any) => {
                                if (e.reason?.includes('signature missing') && ! signingResponse) {
                                    const signingRequest = responseUtils.signingRequest(method, keyManagementSystem.signKid, keyManagementSystem.signAlgorithm, keyManagementSystem.signData);
                                    signingRequestSet[signingRequestId] = signingRequest;
                                    console.log('created signing request ' + signingRequestId + ': ' + JSON.stringify(signingRequest));
                                    return;
                                }
                                console.log('failed to remove service from DID: ' + e.stack);
                                return {code: 500, payload: '' + e};
                            }));
                        }
                    } else {
                        throw "Missing or unsupported didDocumentOperation: " + didDocumentOperation;
                    }
                }

                const promisesResults = (await Promise.all(promises)).filter(e => e);
                console.log('results: ' + JSON.stringify(promisesResults));
                if (promisesResults.length > 0) {
                    resolve(promisesResults[0]);
                    return;
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

const determineMethodNetworkByOptions = function(options: any): any {

    let methodNetwork = options.network;

    console.log('methodNetwork: ' + methodNetwork);
    return methodNetwork;
}

const determineMethodNetworkByDid = function(did: string): any {

    const networkStringMatcher = /^did:ethr(:.+)?:(0x[0-9a-fA-F]{40}|0x[0-9a-fA-F]{66}).*$/;
    const matches = did.match(networkStringMatcher);

    let methodNetwork = matches?.[1]?.substring(1);

    console.log('methodNetwork: ' + methodNetwork);
    return methodNetwork;
}

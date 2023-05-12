import type {IDataStore, IDataStoreORM, IDIDManager, IKeyManager} from '@veramo/core';
import {createAgent, IIdentifier, IKey, ManagedKeyInfo, MinimalImportableKey, TKeyType} from '@veramo/core';
import type {AbstractIdentifierProvider} from '@veramo/did-manager';
import {AbstractDIDStore, DIDManager} from '@veramo/did-manager';
import {EthrDIDProvider} from '@veramo/did-provider-ethr';
// @ts-ignore
import {NetworkType} from '@cheqd/did-provider-cheqd/did-manager/cheqd-did-provider';
import {AbstractKeyManagementSystem, AbstractKeyStore, AbstractPrivateKeyStore, KeyManager} from '@veramo/key-manager';
import {EthrNetworkConfiguration} from "@veramo/did-provider-ethr/src/ethr-did-provider";
import {JsonRpcProvider} from "@ethersproject/providers";
import {KeyManagementSystem} from "@veramo/kms-local";
import {ImportablePrivateKey, ManagedPrivateKey} from "@veramo/key-manager";

const ethrEnabled = process.env.uniregistrar_driver_veramo_ethrEnabled || 'true';

const ethrNetworks = process.env.uniregistrar_driver_veramo_ethrNetworks;
const ethrNetworkRpcUrls = process.env.uniregistrar_driver_veramo_ethrNetworkRpcUrls;
const ethrNetworkMetaPrivateKeys = process.env.uniregistrar_driver_veramo_ethrNetworkMetaPrivateKeys;
const ethrNetworkMetaPublicKeys = process.env.uniregistrar_driver_veramo_ethrNetworkMetaPublicKeys;

if (ethrEnabled && (! ethrNetworks || ! ethrNetworkRpcUrls || ! ethrNetworkMetaPrivateKeys || ! ethrNetworkMetaPublicKeys)) throw("Missing 'uniregistrar_driver_veramo_ethrNetworks' or 'uniregistrar_driver_veramo_ethrNetworkRpcUrls' or 'uniregistrar_driver_veramo_ethrNetworkMetaPrivateKeys' or 'uniregistrar_driver_veramo_ethrNetworkMetaPublicKeys' variable.");

export const createEthrAgent = async function (operation: string, network: string, publicKeyHex?: string) {

    if (! ethrEnabled) throw("'ethr' not enabled.");

    const providers: Record<string, AbstractIdentifierProvider> = { };
    let metaPrivateKey: string | undefined;
    let metaPublicKey: string | undefined;

    if (ethrEnabled && ethrNetworks && ethrNetworkRpcUrls && ethrNetworkMetaPrivateKeys && ethrNetworkMetaPublicKeys) {
        const ethrNetworksList = ethrNetworks?.split(";");
        const ethrNetworkRpcUrlsList = ethrNetworkRpcUrls?.split(";");
        const ethrNetworkMetaPrivateKeysList = ethrNetworkMetaPrivateKeys?.split(";");
        const ethrNetworkMetaPublicKeysList = ethrNetworkMetaPublicKeys?.split(";");
        const networks = [];
        for (var i=0; i<ethrNetworksList.length; i++) {
            if (network !== ethrNetworksList[i]) continue;
            const ethrNetwork = ethrNetworksList[i];
            const ethrNetworkRpcUrl = ethrNetworkRpcUrlsList[i];
            const ethrNetworkMetaPrivateKey = ethrNetworkMetaPrivateKeysList[i];
            const ethrNetworkMetaPublicKey = ethrNetworkMetaPublicKeysList[i];
            const provider: JsonRpcProvider = new JsonRpcProvider(ethrNetworkRpcUrl, ethrNetwork);
            const ethrNetworkConfiguration: EthrNetworkConfiguration = {
                name: ethrNetwork,
                provider: provider
            };
            networks.push(ethrNetworkConfiguration)
            metaPrivateKey = ethrNetworkMetaPrivateKey;
            metaPublicKey = ethrNetworkMetaPublicKey;
        }
        providers['did:ethr'] = new EthrDIDProvider({
            defaultKms: 'local',
            networks: networks
        });
        console.log("Added 'did:ethr' provider with networks " + JSON.stringify(networks) + ".");
    }

    const provider = 'did:ethr';

    const keyStore = new OurKeyStore(operation, metaPublicKey);

    const privateKeyStore = new OurPrivateKeyStore(operation, metaPrivateKey);

    const didStore = new OurDIDStore(provider, operation);

    const didManager = new DIDManager({
        store: didStore,
        defaultProvider: provider,
        providers: providers
    });

    const keyManagementSystem = new OurKeyManagementSystem(privateKeyStore, operation, publicKeyHex);

    const keyManager = new KeyManager({
        store: keyStore,
        kms: {
            local: keyManagementSystem,
        },
    });

    const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM>({
        plugins: [
            keyManager,
            didManager
        ],
    });

    return { keyStore, didStore, didManager, keyManagementSystem, keyManager, agent };
};

class OurKeyStore extends AbstractKeyStore {
    private readonly operation: string
    private readonly metaPublicKey?: string

    constructor(operation: string, metaPublicKey?: string) {
        super();
        this.operation = operation;
        this.metaPublicKey = metaPublicKey;
        console.log("OurKeyStore.constructed: " + JSON.stringify(this));
    }

    async deleteKey(args: { kid: string }): Promise<boolean> {
        console.log("OurKeyStore.deleteKey args: " + JSON.stringify(args));
        throw "Not implemented: OurKeyStore.deleteKey";
    }

    async getKey(args: { kid: string }): Promise<IKey> {
        console.log("OurKeyStore.getKey args: " + JSON.stringify(args));
        let key: IKey;
        if ('metakey' === args.kid) {
            key = {
                kid: args.kid,
                kms: 'local',
                type: 'Secp256k1',
                publicKeyHex: this.metaPublicKey as string
            };
        } else {
            key = {
                kid: args.kid,
                kms: 'local',
                type: 'Secp256k1',
                publicKeyHex: ''
            };
        }
        console.log("OurKeyStore.getKey result: " + JSON.stringify(key));
        return Promise.resolve(key);
    }

    async importKey(args: Partial<IKey>): Promise<boolean> {
        console.log("OurKeyStore.importKey args: " + JSON.stringify(args));
        const result = false;
        console.log("OurKeyStore.importKey result: " + JSON.stringify(result));
        return Promise.resolve(result);
    }

    async listKeys(args: {}): Promise<Array<ManagedKeyInfo>> {
        console.log("OurKeyStore.listKeys args: " + JSON.stringify(args));
        throw "Not implemented: OurKeyStore.listKeys";
    }
}

class OurPrivateKeyStore extends AbstractPrivateKeyStore {
    private readonly operation: string
    private readonly metaPrivateKey?: string

    constructor(operation: string, metaPrivateKey?: string) {
        super();
        this.operation = operation;
        this.metaPrivateKey = metaPrivateKey;
        console.log("OurPrivateKeyStore.constructed: " + JSON.stringify(this));
    }

    async importKey(args: ImportablePrivateKey): Promise<ManagedPrivateKey> {
        console.log("OurPrivateKeyStore.importKey args: " + JSON.stringify(args));
        throw "Not implemented: OurPrivateKeyStore.importKey";
    }

    async getKey(args: { alias: string }): Promise<ManagedPrivateKey> {
        console.log("OurPrivateKeyStore.getKey args: " + JSON.stringify(args));
        let key: ManagedPrivateKey;
        if ('metakey' === args.alias) {
            key = {
                alias: args.alias,
                type: 'Secp256k1',
                privateKeyHex: this.metaPrivateKey as string
            };
        } else {
            key = {
                alias: args.alias,
                type: 'Secp256k1',
                privateKeyHex: 'f85035541e7a120eb74810710fcf40d694473d868ec4ab2b06c79fcb620a6c5b'
            };
//            throw new Error("Private key " + args.alias + " not available.");
        }
        console.log("OurPrivateKeyStore.getKey result: " + JSON.stringify(key));
        return Promise.resolve(key);
    }

    async deleteKey(args: { alias: string }): Promise<boolean> {
        console.log("OurPrivateKeyStore.deleteKey args: " + JSON.stringify(args));
        throw "Not implemented: OurPrivateKeyStore.deleteKey";
    }

    async listKeys(args: {}): Promise<Array<ManagedPrivateKey>> {
        console.log("OurPrivateKeyStore.listKeys args: " + JSON.stringify(args));
        throw "Not implemented: OurPrivateKeyStore.listKeys";
    }
}

class OurKeyManagementSystem extends AbstractKeyManagementSystem {
    private readonly privateKeyStore: AbstractPrivateKeyStore
    private readonly operation: string
    private readonly publicKeyHex?: string
    public signKid?: string
    public signAlgorithm?: string
    public signData?: Uint8Array
    public signResponse?: Uint8Array

    constructor(privateKeyStore: AbstractPrivateKeyStore, operation: string, publicKeyHex?: string) {
        super();
        this.privateKeyStore = privateKeyStore;
        this.operation = operation;
        this.publicKeyHex = publicKeyHex;
        console.log("OurKeyManagementSystem.constructed: " + JSON.stringify(this));
    }

    async createKey(args: { type: TKeyType; meta?: any }): Promise<ManagedKeyInfo> {
        console.log("OurKeyManagementSystem.createKey args: " + JSON.stringify(args));
        let key: Partial<ManagedKeyInfo> = {
            type: 'Secp256k1',
            publicKeyHex: this.publicKeyHex,
            meta: {
                algorithms: ['ES256K', 'ES256K-R'],
            },
        };
        console.log("OurKeyManagementSystem.createKey result: " + JSON.stringify(key));
        return key as ManagedKeyInfo;
    }

    async deleteKey(args: { kid: string }): Promise<boolean> {
        console.log("OurKeyManagementSystem.deleteKey args: " + JSON.stringify(args));
        throw "Not implemented: OurKeyManagementSystem.deleteKey";
    }

    async importKey(args: Exclude<MinimalImportableKey, "kms">): Promise<ManagedKeyInfo> {
        console.log("OurKeyManagementSystem.importKey args: " + JSON.stringify(args));
        throw "Not implemented: OurKeyManagementSystem.importKey";
    }

    async listKeys(): Promise<Array<ManagedKeyInfo>> {
        console.log("OurKeyManagementSystem.listKeys");
        throw "Not implemented: OurKeyManagementSystem.listKeys";
    }

    async sharedSecret(args: { myKeyRef: Pick<IKey, "kid">; theirKey: Pick<IKey, "publicKeyHex" | "type"> }): Promise<string> {
        console.log("OurKeyManagementSystem.sharedSecret args: " + JSON.stringify(args));
        throw "Not implemented: OurKeyManagementSystem.sharedSecret";
    }

    async sign(args: { keyRef: Pick<IKey, "kid">; algorithm?: string; data: Uint8Array; [p: string]: any }): Promise<string> {
        console.log("OurKeyManagementSystem.sign args: " + JSON.stringify(args));
        let signResponse: string;
        if (this.signResponse) {
            signResponse = '0x' + [...this.signResponse].map(x => x.toString(16).padStart(2, '0')).join('');
            this.signResponse = undefined;
/*            const keyManagementSystem: KeyManagementSystem = new KeyManagementSystem(this.privateKeyStore);
            signResponse = await keyManagementSystem.sign(args);*/
        } else if ('metakey' === args.keyRef?.kid) {
            const keyManagementSystem: KeyManagementSystem = new KeyManagementSystem(this.privateKeyStore);
            signResponse = await keyManagementSystem.sign(args);
        } else if (args.data) {
            this.signKid = args.keyRef?.kid;
            this.signAlgorithm = args.algorithm;
            this.signData = args.data;
            signResponse = '';
        } else {
            throw new Error("Cannot sign with " + args.keyRef?.kid);
        }
        console.log("OurKeyManagementSystem.sign result: " + signResponse);
        return Promise.resolve(signResponse);
    }
}

class OurDIDStore extends AbstractDIDStore {
    private readonly provider: string
    private readonly operation: string
    public didDocument?: any

    constructor(provider: string, operation: string) {
        super();
        this.provider = provider;
        this.operation = operation;
        console.log("OurDIDStore.constructed: " + JSON.stringify(this));
    }

    async importDID(args: IIdentifier): Promise<boolean> {
        console.log("OurDIDStore.import args: " + JSON.stringify(args));
        const result = false;
        console.log("OurDIDStore.importDID result: " + JSON.stringify(result));
        return Promise.resolve(result);
    }

    async getDID(args: { did: string; alias: string; provider: string }): Promise<IIdentifier> {
        console.log("OurDIDStore.getDID args: " + JSON.stringify(args));
        if ('create' === this.operation) {
            throw "Not implemented: OurDIDStore.getDID";
        } else {
            let identifier: IIdentifier = {
                did: args.did,
                provider: this.provider,
                controllerKeyId: args.did + '#controllerKey',
                keys: [],
                services: []
            };
            if (this.didDocument?.verificationMethod) identifier.keys = this.didDocument.verificationMethod;
            if (this.didDocument?.service) identifier.services = this.didDocument.service;
            console.log("OurDIDStore.getDID result: " + JSON.stringify(identifier));
            return Promise.resolve(identifier);
        }
    }

    async deleteDID(args: { did: string }): Promise<boolean> {
        console.log("OurDIDStore.deleteDID args: " + JSON.stringify(args));
        throw "Not implemented: OurDIDStore.deleteDID";
    }

    async listDIDs(args: { alias?: string; provider?: string }): Promise<IIdentifier[]> {
        console.log("OurDIDStore.listDIDs args: " + JSON.stringify(args));
        throw "Not implemented: OurDIDStore.listDIDs";
    }
}

import type {IDataStore, IDataStoreORM, IDIDManager, IKeyManager} from '@veramo/core';
import {createAgent, IIdentifier, IKey, ManagedKeyInfo, MinimalImportableKey, TKeyType} from '@veramo/core';
import type {AbstractIdentifierProvider} from '@veramo/did-manager';
import {AbstractDIDStore, DIDManager} from '@veramo/did-manager';
import {PkhDIDProvider} from '@veramo/did-provider-pkh';
// @ts-ignore
import {NetworkType} from '@cheqd/did-provider-cheqd/did-manager/cheqd-did-provider';
import {AbstractKeyManagementSystem, AbstractKeyStore, KeyManager} from '@veramo/key-manager';

const pkhEnabled = process.env.uniregistrar_driver_veramo_pkhEnabled || 'true';

export const createPkhAgent = async function (operation: string, chainId: string, publicKeyHex?: string) {

    if (! pkhEnabled) throw("'pkh' not enabled.");

    const providers: Record<string, AbstractIdentifierProvider> = { };

    if (pkhEnabled) {
        providers['did:pkh'] = new PkhDIDProvider({
            defaultKms: 'local',
            chainId: chainId
        });
        console.log("Added 'did:pkh' provider.");
    }

    const provider = 'did:pkh';

    const keyStore = new OurKeyStore(operation);

    const didStore = new OurDIDStore(provider, operation);

    const didManager = new DIDManager({
        store: didStore,
        defaultProvider: provider,
        providers: providers
    });

    const keyManagementSystem = new OurKeyManagementSystem(operation, publicKeyHex);

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

export class OurKeyStore extends AbstractKeyStore {
    private readonly operation: string

    constructor(operation: string) {
        super();
        this.operation = operation;
        console.log("OurKeyStore.constructed: " + JSON.stringify(this));
    }

    async deleteKey(args: { kid: string }): Promise<boolean> {
        console.log("OurKeyStore.deleteKey args: " + JSON.stringify(args));
        throw "Not implemented: OurKeyStore.deleteKey";
    }

    async getKey(args: { kid: string }): Promise<IKey> {
        console.log("OurKeyStore.getKey args: " + JSON.stringify(args));
        let key: IKey = {
            kid: args.kid,
            kms: 'local',
            type: 'Ed25519',
            publicKeyHex: ''
        };
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

export class OurKeyManagementSystem extends AbstractKeyManagementSystem {
    private readonly operation: string
    private readonly publicKeyHex?: string

    constructor(operation: string, publicKeyHex?: string) {
        super();
        this.operation = operation;
        this.publicKeyHex = publicKeyHex
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
        throw "Not implemented: OurKeyManagementSystem.sign";
    }
}

export class OurDIDStore extends AbstractDIDStore {
    private readonly provider: string
    private readonly operation: string

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
                controllerKeyId: args.did + '#blockchainAccountIdKey',
                keys: [],
                services: []
            };
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

import type {IDataStore, IDataStoreORM, IDIDManager, IKeyManager} from '@veramo/core';
import {createAgent, IIdentifier, IKey, ManagedKeyInfo, MinimalImportableKey, TKeyType} from '@veramo/core';
import type {AbstractIdentifierProvider} from '@veramo/did-manager';
import {AbstractDIDStore, DIDManager} from '@veramo/did-manager';
import {EthrDIDProvider} from '@veramo/did-provider-ethr';
// @ts-ignore
import {NetworkType} from '@cheqd/did-provider-cheqd/did-manager/cheqd-did-provider';
import {AbstractKeyManagementSystem, AbstractKeyStore, KeyManager} from '@veramo/key-manager';

const ethrEnabled = process.env.uniregistrar_driver_veramo_ethrEnabled || 'true';

const ethrNetworks = process.env.uniregistrar_driver_veramo_ethrNetworks;
const ethrNetworkRpcUrls = process.env.uniregistrar_driver_veramo_ethrNetworkRpcUrls;

if (ethrEnabled && (! ethrNetworks || ! ethrNetworkRpcUrls)) throw("Missing 'uniregistrar_driver_veramo_ethrNetworks' or 'uniregistrar_driver_veramo_ethrNetworkRpcUrls' variable.");

export const createEthrAgent = async function (operation: string, publicKeyHex?: string, signingResponseSet?: any) {

    if (! ethrEnabled) throw("'ethr' not enabled.");

    const providers: Record<string, AbstractIdentifierProvider> = { };
    if (ethrEnabled && ethrNetworks && ethrNetworkRpcUrls) {
        const ethrNetworksList = ethrNetworks?.split(";");
        const ethrNetworkRpcUrlsList = ethrNetworkRpcUrls?.split(";");
        const networks = [];
        for (var i=0; i<ethrNetworksList.length; i++) {
            networks.push({name: ethrNetworksList[i], rpcUrl: ethrNetworkRpcUrlsList[i]})
        }
        providers['did:ethr'] = new EthrDIDProvider({
            defaultKms: 'local',
            networks: networks
        });
        console.log("Added 'did:ethr' provider with networks " + JSON.stringify(networks) + ".");
    }

    const provider = 'did:ethr';

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

class OurKeyStore extends AbstractKeyStore {
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
        console.log("OutKeyStore.getKey result: " + JSON.stringify(key));
        return Promise.resolve(key);
    }

    async importKey(args: Partial<IKey>): Promise<boolean> {
        console.log("OurKeyStore.importKey args: " + JSON.stringify(args));
        return Promise.resolve(false);
    }

    async listKeys(args: {}): Promise<Array<ManagedKeyInfo>> {
        console.log("OurKeyStore.listKeys args: " + JSON.stringify(args));
        throw "Not implemented: OurKeyStore.listKeys";
    }
}

class OurKeyManagementSystem extends AbstractKeyManagementSystem {
    private readonly operation: string
    private readonly publicKeyHex?: string
    public signKid?: string
    public signAlgorithm?: string
    public signData?: Uint8Array
    public signResponse?: Uint8Array

    constructor(operation: string, publicKeyHex?: string) {
        super();
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
        if (this.signResponse) {
            let signResponse: string = [...this.signResponse].map(x => x.toString(16).padStart(2, '0')).join('');
            console.log("OurKeyManagementSystem.sign result: " + signResponse);
            return Promise.resolve(signResponse);
        } else if (args.data) {
            this.signKid = args.keyRef.kid;
            this.signAlgorithm = args.algorithm;
            this.signData = args.data;
            let signResponse = '';
            console.log("OurKeyManagementSystem.sign result: " + signResponse);
            return Promise.resolve(signResponse);
        }
        throw "Not implemented: OurKeyManagementSystem.sign";
    }
}

class OurDIDStore extends AbstractDIDStore {
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
        return Promise.resolve(false);
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

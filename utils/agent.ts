
import { createAgent, IDIDManager, IKeyManager, IDataStore, IDataStoreORM } from '@veramo/core';
import { DIDManager, AbstractIdentifierProvider} from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { PkhDIDProvider } from '@veramo/did-provider-pkh';
import { CheqdDIDProvider } from '@cheqd/did-provider-cheqd';
import { KeyManager } from '@veramo/key-manager';
import { OurDIDStore } from "../service/OurDIDStore";
import { OurKeyStore } from "../service/OurKeyStore";
import { OurPrivateKeyStore } from "../service/OurPrivateKeyStore";
import { OurKeyManagementSystem } from "../service/OurKeyManagementSystem";

const ethrEnabled = process.env.uniregistrar_driver_veramo_ethrEnabled || 'true';
const pkhEnabled = process.env.uniregistrar_driver_veramo_pkhEnabled || 'true';
const cheqdEnabled = process.env.uniregistrar_driver_veramo_cheqdEnabled || 'true';
const ethrNetworks = process.env.uniregistrar_driver_veramo_ethrNetworks;
const ethrNetworkRpcUrls = process.env.uniregistrar_driver_veramo_ethrNetworkRpcUrls;
const cheqdCosmosPayerMnemonic = process.env.uniregistrar_driver_veramo_cheqdCosmosPayerMnemonic;

if (ethrEnabled && ! ethrNetworks) console.log("Warning: Missing 'uniregistrar_driver_veramo_ethrNetworks' variable.");
if (pkhEnabled && ! ethrNetworkRpcUrls) console.log("Missing 'uniregistrar_driver_veramo_ethrNetworkRpcUrls' variable.");
if (cheqdEnabled && ! cheqdCosmosPayerMnemonic) console.log("Missing 'uniregistrar_driver_veramo_cheqdCosmosPayerMnemonic variable.");

const providers: Record<string, AbstractIdentifierProvider> = { };
if (ethrEnabled) {
    const networks = [];
    const ethrNetworksList = ethrNetworks?.split(";");
    const ethrNetworkRpcUrlsList = ethrNetworkRpcUrls?.split(";");
    if (ethrNetworksList && ethrNetworkRpcUrlsList) {
        for (var i=0; i < ethrNetworksList.length; i++) {
            networks.push({name: ethrNetworksList[i], rpcUrl: ethrNetworkRpcUrlsList[i]})
        }
    }
    providers['did:ethr'] = new EthrDIDProvider({
        defaultKms: 'local',
        networks: networks
    });
    console.log("Added 'did:ethr' provider.");
}
if (pkhEnabled) {
    providers['did:pkh'] = new PkhDIDProvider({
        defaultKms: 'local'
    });
    console.log("Added 'did:pkh' provider.");
}
if (cheqdEnabled) {
    var cosmosPayerMnemonic = '';
    if (cheqdCosmosPayerMnemonic) {
        cosmosPayerMnemonic = cheqdCosmosPayerMnemonic;
    }
    providers['did:cheqd'] = new CheqdDIDProvider({
        defaultKms: 'local',
        cosmosPayerMnemonic: cosmosPayerMnemonic
    });
    console.log("Added 'did:cheqd' provider.");
}

export const keyStore = new OurKeyStore();
export const privateKeyStore = new OurPrivateKeyStore();

export const memoryDidStore = new OurDIDStore();
export const didManager = new DIDManager({
    store: memoryDidStore,
    defaultProvider: '',
    providers: providers
});

export const createTempAgent = function(provider: string, publicKeyHex: string) {
    const keyManagementSystem = new OurKeyManagementSystem(privateKeyStore, provider, publicKeyHex);
    const keyManager = new KeyManager({
        store: keyStore,
        kms: {
            local: keyManagementSystem,
        },
    });
    return createAgent < IDIDManager & IKeyManager & IDataStore & IDataStoreORM > ({
        plugins: [
            keyManager,
            didManager
        ],
    });
};


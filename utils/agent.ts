import { createAgent, IDataStore, IDataStoreORM, IDIDManager, IKeyManager } from '@veramo/core';
import { AbstractIdentifierProvider, DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { PkhDIDProvider } from '@veramo/did-provider-pkh';
import { CheqdDIDProvider } from '@cheqd/did-provider-cheqd';
import { NetworkType } from '@cheqd/did-provider-cheqd/build/did-manager/cheqd-did-provider';
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
const cheqdNetworks = process.env.uniregistrar_driver_veramo_cheqdNetworks;
const cheqdNetworkRpcUrls = process.env.uniregistrar_driver_veramo_cheqdNetworkRpcUrls;
const cheqdNetworkCosmosPayerMnemonics = process.env.uniregistrar_driver_veramo_cheqdNetworkCosmosPayerMnemonics;

if (ethrEnabled && (! ethrNetworks || ! ethrNetworkRpcUrls)) throw("Missing 'uniregistrar_driver_veramo_ethrNetworks' or 'uniregistrar_driver_veramo_ethrNetworkRpcUrls' variable.");
if (cheqdEnabled && (! cheqdNetworks || ! cheqdNetworkRpcUrls || ! cheqdNetworkCosmosPayerMnemonics)) throw("Missing 'uniregistrar_driver_veramo_cheqdNetworks' or 'uniregistrar_driver_veramo_cheqdNetworkRpcUrls'  or 'uniregistrar_driver_veramo_cheqdNetworkCosmosPayerMnemonics' variable.");

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
if (pkhEnabled) {
    providers['did:pkh'] = new PkhDIDProvider({
        defaultKms: 'local'
    });
    console.log("Added 'did:pkh' provider.");
}
if (cheqdEnabled && cheqdNetworks && cheqdNetworkRpcUrls && cheqdNetworkCosmosPayerMnemonics) {
    const cheqdNetworksList = cheqdNetworks?.split(";");
    const cheqdNetworkRpcUrlsList = cheqdNetworkRpcUrls?.split(";");
    const cheqdNetworkCosmosPayerMnemonicsList = cheqdNetworkCosmosPayerMnemonics?.split(";");
    for (var i=0; i<cheqdNetworksList.length; i++) {
        const network = cheqdNetworksList[i];
        const rpcUrl = cheqdNetworkRpcUrlsList[i];
        const cosmosPayerMnemonic = cheqdNetworkCosmosPayerMnemonicsList[i];
        var networkType: NetworkType;
        if (network === 'mainnet') networkType = NetworkType.Mainnet;
        else if (network === 'testnet') networkType = NetworkType.Testnet;
        else throw ("Unknown did:cheqd network: " + network);
        providers['did:cheqd' + ':' + network] = new CheqdDIDProvider({
            defaultKms: 'local',
            networkType: networkType,
            rpcUrl: rpcUrl,
            cosmosPayerMnemonic: cosmosPayerMnemonic
        });
        console.log("Added 'did:cheqd:" + network + "' provider.");
    }
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


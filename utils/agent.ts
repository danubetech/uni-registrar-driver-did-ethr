import type { IDataStore, IDataStoreORM, IDIDManager, IKeyManager } from '@veramo/core';
import type { AbstractIdentifierProvider } from '@veramo/did-manager';

import { DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { PkhDIDProvider } from '@veramo/did-provider-pkh';
import { CheqdDIDProvider } from '@cheqd/did-provider-cheqd';
// @ts-ignore
import { NetworkType } from '@cheqd/did-provider-cheqd/did-manager/cheqd-did-provider';
import { KeyManager } from '@veramo/key-manager';
import { createAgent } from '@veramo/core';
import { OurDIDStore } from "../service/OurDIDStore.js";
import { OurKeyStore } from "../service/OurKeyStore.js";
import { OurPrivateKeyStore } from "../service/OurPrivateKeyStore.js";
import { OurKeyManagementSystem } from "../service/OurKeyManagementSystem.js";

const ethrEnabled = process.env.uniregistrar_driver_veramo_ethrEnabled || 'true';
const pkhEnabled = process.env.uniregistrar_driver_veramo_pkhEnabled || 'true';
const cheqdEnabled = process.env.uniregistrar_driver_veramo_cheqdEnabled || 'true';

const ethrNetworks = process.env.uniregistrar_driver_veramo_ethrNetworks;
const ethrNetworkRpcUrls = process.env.uniregistrar_driver_veramo_ethrNetworkRpcUrls;
const cheqdNetworks = process.env.uniregistrar_driver_veramo_cheqdNetworks;
const cheqdNetworkRpcUrls = process.env.uniregistrar_driver_veramo_cheqdNetworkRpcUrls;
const cheqdNetworkCosmosPayerSeeds = process.env.uniregistrar_driver_veramo_cheqdNetworkCosmosPayerSeeds;

if (ethrEnabled && (! ethrNetworks || ! ethrNetworkRpcUrls)) throw("Missing 'uniregistrar_driver_veramo_ethrNetworks' or 'uniregistrar_driver_veramo_ethrNetworkRpcUrls' variable.");
if (cheqdEnabled && (! cheqdNetworks || ! cheqdNetworkRpcUrls || ! cheqdNetworkCosmosPayerSeeds)) throw("Missing 'uniregistrar_driver_veramo_cheqdNetworks' or 'uniregistrar_driver_veramo_cheqdNetworkRpcUrls'  or 'uniregistrar_driver_veramo_cheqdNetworkCosmosPayerSeeds' variable.");

export const createTempAgent = async function (provider: string, operation: string, publicKeyHex: string, pkhProviderChainId: string) {

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
            defaultKms: 'local',
            chainId: pkhProviderChainId
        });
        console.log("Added 'did:pkh' provider.");
    }
    if (cheqdEnabled && cheqdNetworks && cheqdNetworkRpcUrls && cheqdNetworkCosmosPayerSeeds) {
        const cheqdNetworksList = cheqdNetworks?.split(";");
        const cheqdNetworkRpcUrlsList = cheqdNetworkRpcUrls?.split(";");
        const cheqdNetworkCosmosPayerSeedsList = cheqdNetworkCosmosPayerSeeds?.split(";");
        for (var i=0; i<cheqdNetworksList.length; i++) {
            const network = cheqdNetworksList[i];
            const rpcUrl = cheqdNetworkRpcUrlsList[i];
            const cosmosPayerSeed = cheqdNetworkCosmosPayerSeedsList[i];
            var networkType;
            if (network === 'mainnet') networkType = NetworkType.Mainnet;
            else if (network === 'testnet') networkType = NetworkType.Testnet;
            else throw ("Unknown did:cheqd network: " + network);
            providers['did:cheqd' + ':' + network] = new CheqdDIDProvider({
                defaultKms: 'local',
                networkType: networkType,
                rpcUrl: rpcUrl,
                cosmosPayerSeed: cosmosPayerSeed
            });
            console.log("Added 'did:cheqd:" + network + "' provider.");
        }
    }

    const keyStore = new OurKeyStore();
    const privateKeyStore = new OurPrivateKeyStore();

    const memoryDidStore = new OurDIDStore(provider, operation);
    const didManager = new DIDManager({
        store: memoryDidStore,
        defaultProvider: '',
        providers: providers
    });

    const keyManagementSystem = new OurKeyManagementSystem(provider, publicKeyHex);

    const keyManager = new KeyManager({
        store: keyStore,
        kms: {
            local: keyManagementSystem,
        },
    });

    return createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM>({
        plugins: [
            keyManager,
            didManager
        ],
    });
};

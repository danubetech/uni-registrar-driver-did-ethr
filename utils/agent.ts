
import { createAgent, IDIDManager, IKeyManager, IDataStore, IDataStoreORM, IResolver } from '@veramo/core';
import { DIDManager, MemoryDIDStore} from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { PkhDIDProvider } from '@veramo/did-provider-pkh';
import { CheqdDIDProvider } from '@cheqd/did-provider-cheqd';
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';

const ethrNetworks = process.env.uniregistrar_driver_veramo_ethrNetworks;
const ethrNetworkRpcUrls = process.env.uniregistrar_driver_veramo_ethrNetworkRpcUrls;
const cheqdCosmosPayerMnemonic = process.env.uniregistrar_driver_veramo_cheqdCosmosPayerMnemonic;

if (! ethrNetworks) throw "Missing 'uniregistrar_driver_veramo_ethrNetworks' variable.";
if (! ethrNetworkRpcUrls) throw "Missing 'uniregistrar_driver_veramo_ethrNetworkRpcUrls' variable.";
if (! cheqdCosmosPayerMnemonic) throw "Missing 'uniregistrar_driver_veramo_cheqdCosmosPayerMnemonic' variable.";

const ethrNetworksList = ethrNetworks.split(";");
const ethrNetworkRpcUrlsList = ethrNetworkRpcUrls.split(";");

const networks = [];
for (var i=0; i<ethrNetworksList.length; i++) { networks.push({ name: ethrNetworksList[i], rpcUrl: ethrNetworkRpcUrlsList[i] }) }
const cosmosPayerMnemonic = cheqdCosmosPayerMnemonic;

export const agent = createAgent < IDIDManager & IKeyManager & IDataStore & IDataStoreORM > ({
    plugins: [
        new KeyManager({
            store: new MemoryKeyStore(),
            kms: {
                local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
            },
        }),
        new DIDManager({
            store: new MemoryDIDStore(),
            defaultProvider: '',
            providers: {
                'did:ethr': new EthrDIDProvider({
                    defaultKms: 'local',
                    networks: networks
                }),
                'did:pkh': new PkhDIDProvider({
                    defaultKms: 'local'
                }),
                'did:cheqd': new CheqdDIDProvider({
                    defaultKms: 'local',
                    cosmosPayerMnemonic: cosmosPayerMnemonic
                }),
            },
        })
    ],
});

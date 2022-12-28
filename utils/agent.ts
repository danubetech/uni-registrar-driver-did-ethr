
import { createAgent, IDIDManager, IKeyManager, IDataStore, IDataStoreORM } from '@veramo/core';
import { DIDManager, MemoryDIDStore} from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { PkhDIDProvider } from '@veramo/did-provider-pkh';
import { CheqdDIDProvider } from '@cheqd/did-provider-cheqd';
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore} from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';

const INFURA_PROJECT_ID = 'ceaa1e1503234310b7b42dbad742a94d';

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
                    networks: [
                        {
                            name: 'mainnet',
                            rpcUrl: 'https://mainnet.infura.io/v3/' + INFURA_PROJECT_ID,
                        }, {
                            name: 'goerli',
                            rpcUrl: 'https://goerli.infura.io/v3/' + INFURA_PROJECT_ID,
                        }, {
                            name: 'sepolia',
                            rpcUrl: 'https://sepolia.infura.io/v3/' + INFURA_PROJECT_ID,
                        }
                    ]
                }),
                'did:pkh': new PkhDIDProvider({
                    defaultKms: 'local'
                }),
                'did:cheqd': new CheqdDIDProvider({
                    defaultKms: 'local',
                    cosmosPayerMnemonic: 'glory remain shrug expand feed they notice similar diagram acquire hour razor'
                }),
            },
        })
    ],
});

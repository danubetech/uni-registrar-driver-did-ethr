
// Core interfaces
import { createAgent, IDIDManager, IKeyManager, IDataStore, IDataStoreORM } from '@veramo/core';

// Core identity manager plugin
import { DIDManager, MemoryDIDStore} from '@veramo/did-manager';

// Ethr did identity provider
import { EthrDIDProvider } from '@veramo/did-provider-ethr';

// Core key manager plugin
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore} from '@veramo/key-manager';

// Custom key management system for RN
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
            defaultProvider: 'did:ethr:goerli',
            providers: {
                'did:ethr:goerli': new EthrDIDProvider({
                    defaultKms: 'local',
                    network: 'goerli',
                    rpcUrl: 'https://goerli.infura.io/v3/' + INFURA_PROJECT_ID,
                }),
            },
        })
    ],
});

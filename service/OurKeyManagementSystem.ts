import { TKeyType, IKey, ManagedKeyInfo, MinimalImportableKey, RequireOnly } from '@veramo/core'
import { AbstractKeyManagementSystem, AbstractPrivateKeyStore, Eip712Payload } from '@veramo/key-manager'

export class OurKeyManagementSystem extends AbstractKeyManagementSystem {
  private readonly provider: string
  private readonly publicKeyHex: string

  constructor(provider: string, publicKeyHex: string) {
    super()
    this.provider = provider
    this.publicKeyHex = publicKeyHex
  }

  async createKey(args: { type: TKeyType; meta?: any }): Promise<ManagedKeyInfo> {
    console.log("OurKeyManagementSystem.createKey args: " + JSON.stringify(args));
    let key: Partial<ManagedKeyInfo>;
    if ('did:ethr' === this.provider) {
      key = {
        type: 'Secp256k1',
        publicKeyHex: this.publicKeyHex,
        meta: {
          algorithms: ['ES256K', 'ES256K-R'],
        },
      };
    } else if ('did:pkh' === this.provider) {
      key = {
        type: 'Secp256k1',
        publicKeyHex: this.publicKeyHex,
        meta: {
          algorithms: ['ES256K', 'ES256K-R'],
        },
      };
    } else if ('did:cheqd' === this.provider) {
      key = {
        type: 'Ed25519',
        publicKeyHex: this.publicKeyHex,
        meta: {
          algorithms: ['EdDSA'],
        },
      };
    } else {
      throw 'Unsupported provider (createKey): ' + this.provider;
    }
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

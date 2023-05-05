import { IKey, ManagedKeyInfo } from '@veramo/core'
import { AbstractKeyStore } from '@veramo/key-manager'

export class OurKeyStore extends AbstractKeyStore {
  async deleteKey(args: { kid: string }): Promise<boolean> {
    console.log("OurKeyStore.deleteKey args: " + JSON.stringify(args));
    throw "Not implemented: OurKeyStore.deleteKey";
  }

  async getKey(args: { kid: string }): Promise<IKey> {
    console.log("OurKeyStore.getKey args: " + JSON.stringify(args));
    return Promise.resolve({
      kid: '',
      kms: '',
      type: 'Ed25519',
      publicKeyHex: ''
    });
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

import { IKey, ManagedKeyInfo } from '@veramo/core'
import { AbstractKeyStore } from '@veramo/key-manager'

export class OurKeyStore extends AbstractKeyStore {
  async deleteKey(args: { kid: string }): Promise<boolean> {
    throw "Not implemented: OurKeyStore.get";
  }

  async getKey(args: { kid: string }): Promise<IKey> {
    throw "Not implemented: OurKeyStore.delete";
  }

  async importKey(args: Partial<IKey>): Promise<boolean> {
    console.log("OurKeyStore.import args: " + JSON.stringify(args));
    return false;
  }

  async listKeys(args: {}): Promise<Array<ManagedKeyInfo>> {
    throw "Not implemented: OurKeyStore.list";
  }
}

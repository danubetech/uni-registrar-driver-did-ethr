import { IKey, ManagedKeyInfo } from '@veramo/core'
import { AbstractKeyStore } from '@veramo/key-manager'

export class OurKeyStore extends AbstractKeyStore {
  async delete(args: { kid: string }): Promise<boolean> {
    throw "Not implemented: OurKeyStore.get";
  }

  async get(args: { kid: string }): Promise<IKey> {
    throw "Not implemented: OurKeyStore.delete";
  }

  async import(args: Partial<IKey>): Promise<boolean> {
    console.log("OurKeyStore.import args: " + JSON.stringify(args));
    return false;
  }

  async list(args: {}): Promise<Array<ManagedKeyInfo>> {
    throw "Not implemented: OurKeyStore.list";
  }
}

import { AbstractPrivateKeyStore, ImportablePrivateKey, ManagedPrivateKey } from '@veramo/key-manager'

export class OurPrivateKeyStore extends AbstractPrivateKeyStore {
  private privateKeys: Record<string, ManagedPrivateKey> = {}

  async getKey({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    throw "Not implemented: OurPrivateKeyStore.get";
  }

  async deleteKey({ alias }: { alias: string }): Promise<boolean> {
    throw "Not implemented: OurPrivateKeyStore.delete";
    return false;
  }

  async importKey(args: ImportablePrivateKey): Promise<ManagedPrivateKey> {
    throw "Not implemented: OurPrivateKeyStore.import";
  }

  async listKeys(): Promise<Array<ManagedPrivateKey>> {
    throw "Not implemented: OurPrivateKeyStore.list";
  }
}

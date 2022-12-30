import { AbstractPrivateKeyStore, ImportablePrivateKey, ManagedPrivateKey } from '@veramo/key-manager'

export class OurPrivateKeyStore extends AbstractPrivateKeyStore {
  private privateKeys: Record<string, ManagedPrivateKey> = {}

  async get({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    throw "Not implemented: OurPrivateKeyStore.get";
  }

  async delete({ alias }: { alias: string }): Promise<boolean> {
    throw "Not implemented: OurPrivateKeyStore.delete";
    return false;
  }

  async import(args: ImportablePrivateKey): Promise<ManagedPrivateKey> {
    throw "Not implemented: OurPrivateKeyStore.import";
  }

  async list(): Promise<Array<ManagedPrivateKey>> {
    throw "Not implemented: OurPrivateKeyStore.list";
  }
}

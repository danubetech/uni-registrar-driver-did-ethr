import { AbstractPrivateKeyStore, ImportablePrivateKey, ManagedPrivateKey } from '@veramo/key-manager'

export class OurPrivateKeyStore extends AbstractPrivateKeyStore {
  private privateKeys: Record<string, ManagedPrivateKey> = {}

  async getKey({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    console.log("OurPrivateKeyStore.getKey args: " + JSON.stringify(alias));
    throw "Not implemented: OurPrivateKeyStore.getKey";
  }

  async deleteKey({ alias }: { alias: string }): Promise<boolean> {
    console.log("OurPrivateKeyStore.deleteKey args: " + JSON.stringify(alias));
    throw "Not implemented: OurPrivateKeyStore.deleteKey";
    return false;
  }

  async importKey(args: ImportablePrivateKey): Promise<ManagedPrivateKey> {
    console.log("OurPrivateKeyStore.importKey args: " + JSON.stringify(args));
    throw "Not implemented: OurPrivateKeyStore.importKey";
  }

  async listKeys(): Promise<Array<ManagedPrivateKey>> {
    console.log("OurPrivateKeyStore.listKeys");
    throw "Not implemented: OurPrivateKeyStore.listKeys";
  }
}

import type { IIdentifier } from "@veramo/core";
import { AbstractDIDStore } from "@veramo/did-manager";

export class OurDIDStore extends AbstractDIDStore {
  private readonly provider: string
  private readonly operation: string

  constructor(provider: string, operation: string) {
    super()
    this.provider = provider;
    this.operation = operation;
  }

  async importDID(args: IIdentifier): Promise<boolean> {
    console.log("OurDIDStore.import args: " + JSON.stringify(args));
    return Promise.resolve(false);
  }

  async getDID(args: { did: string; alias: string; provider: string }): Promise<IIdentifier> {
    console.log("OurDIDStore.getDID args: " + JSON.stringify(args));
    if ('create' === this.operation) {
      throw "Not implemented: OurDIDStore.getDID";
    } else {
      return Promise.resolve({
        did: args.did,
        provider: this.provider,
        controllerKeyId: args.did + '#controllerKey',
        keys: [],
        services: []
      });
    }
  }

  async deleteDID(args: { did: string }): Promise<boolean> {
    console.log("OurDIDStore.deleteDID args: " + JSON.stringify(args));
    throw "Not implemented: OurDIDStore.deleteDID";
  }

  async listDIDs(args: { alias?: string; provider?: string }): Promise<IIdentifier[]> {
    console.log("OurDIDStore.listDIDs args: " + JSON.stringify(args));
    throw "Not implemented: OurDIDStore.listDIDs";
  }
}

import type { IIdentifier } from "@veramo/core";
import { AbstractDIDStore } from "@veramo/did-manager";

export class OurDIDStore extends AbstractDIDStore {

  async deleteDID(args: { did: string }): Promise<boolean> {
    throw "Not implemented: OurDIDStore.deleteDID";
  }

  async getDID(args: { did: string }): Promise<IIdentifier>;
  async getDID(args: { alias: string; provider: string }): Promise<IIdentifier>;
  async getDID(args: { did: string } | { alias: string; provider: string }): Promise<IIdentifier> {
    throw "Not implemented: OurDIDStore.get";
  }

  async importDID(args: IIdentifier): Promise<boolean> {
    console.log("OurDIDStore.import args: " + JSON.stringify(args));
    return false;
  }

  async listDIDs(args: { alias?: string; provider?: string }): Promise<IIdentifier[]> {
    throw "Not implemented: OurDIDStore.list";
  }
}

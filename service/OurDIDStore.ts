import { IIdentifier } from "@veramo/core";
import { AbstractDIDStore } from "@veramo/did-manager";

export class OurDIDStore extends AbstractDIDStore {

  async delete(args: { did: string }): Promise<boolean> {
    throw "Not implemented: OurDIDStore.delete";
  }

  async get(args: { did: string }): Promise<IIdentifier>;
  async get(args: { alias: string; provider: string }): Promise<IIdentifier>;
  async get(args: { did: string } | { alias: string; provider: string }): Promise<IIdentifier> {
    throw "Not implemented: OurDIDStore.get";
  }

  async import(args: IIdentifier): Promise<boolean> {
    console.log("OurDIDStore.import args: " + JSON.stringify(args));
    return false;
  }

  async list(args: { alias?: string; provider?: string }): Promise<IIdentifier[]> {
    throw "Not implemented: OurDIDStore.list";
  }
}

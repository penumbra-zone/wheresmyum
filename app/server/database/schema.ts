export interface Schema {
  wmu_transfers: WmuTransfers;
  block_details: BlockDetails;
}

export interface WmuTransfers {
  rowid: number;
  channel: string;
  sequence: bigint;
  asset_id: Uint8Array;
  amount: string;
  sender: Uint8Array;
  receiver: string;
  height: bigint;
  tx?: Uint8Array;
}

export interface BlockDetails {
  height: bigint;
  root: Uint8Array;
  timestamp: Date;
}

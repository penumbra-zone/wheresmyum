import { Jsonified } from "@penumbra-zone/types/jsonified";
import { Database } from "backend/database";

/**
 * Represents a single IBC transfer.
 */
export default class Transfer {
  constructor(public timestamp: Date) {}

  /**
   * Fetch recent transfers from a database.
   *
   * @param limit if present, the number of transfers to fetch.
   */
  static async fetchMany(db: Database, limit?: number): Promise<Transfer[]> {
    let query = db
      .selectFrom("wmu_transfers")
      .innerJoin(
        "block_details",
        "block_details.height",
        "wmu_transfers.height",
      )
      .orderBy("rowid desc")
      .select(["timestamp"]);
    if (limit) {
      query = query.limit(limit);
    }
    const res = await query.execute();
    return res.map(({ timestamp }) => new Transfer(timestamp));
  }

  toJSON(): Jsonified<Transfer> {
    // toISOString, because `Jsonified` requires that we turn Dates into strings.
    return { ...this, timestamp: this.timestamp.toISOString() };
  }

  static fromJSON(data: Jsonified<Transfer>): Transfer {
    return new Transfer(new Date(data.timestamp));
  }
}

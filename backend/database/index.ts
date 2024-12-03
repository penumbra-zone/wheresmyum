import pkg from "pg";
const { Pool, types } = pkg;
import fs from "fs";
import { Kysely, PostgresDialect } from "kysely";
import { Schema } from "./schema";

const ca = process.env.PENUMBRA_INDEXER_CA_CERT;
const connectionString = process.env.PENUMBRA_INDEXER_ENDPOINT;
const dbConfig = {
  connectionString: connectionString,
  ...(ca && {
    ssl: {
      rejectUnauthorized: true,
      ca: ca.startsWith("-----BEGIN CERTIFICATE-----")
        ? ca
        : fs.readFileSync(ca, "utf-8"),
    },
  }),
};
const dialect = new PostgresDialect({
  pool: new Pool(dbConfig),
});

export type Database = Kysely<Schema>;
export type { Schema } from "./schema";

export const db = new Kysely<Schema>({ dialect });

const int8TypeId = 20;
// Map int8 to number.
types.setTypeParser(int8TypeId, (val) => {
  return BigInt(val);
});

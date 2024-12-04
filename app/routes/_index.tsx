import { Jsonified } from "@penumbra-zone/types/jsonified";
import { Density } from "@penumbra-zone/ui/Density";
import { Display } from "@penumbra-zone/ui/Display";
import { Text } from "@penumbra-zone/ui/Text";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { Database, db } from "backend/database";
import Transfer from "shared/Transfer";

class Data {
  constructor(public transfers: Transfer[]) {}

  static async fetch(db: Database): Promise<Data> {
    const [transfers] = await Promise.all([Transfer.fetchMany(db, 100)]);
    return new Data(transfers);
  }

  toJSON(): Jsonified<Data> {
    return { transfers: this.transfers.map((x) => x.toJSON()) };
  }

  static fromJSON(data: Jsonified<Data>): Data {
    return new Data(data.transfers.map((x) => Transfer.fromJSON(x)));
  }
}

export const loader = async (): Promise<Data> => {
  return await Data.fetch(db);
};

export const meta: MetaFunction = () => {
  return [{ title: "Where's My Um?" }];
};

export default function Index() {
  const raw = useLoaderData<Jsonified<Data>>();
  return (
    <Display>
      <Density compact>
        <Text h1 color="text.primary">
          {JSON.stringify(raw)}
        </Text>
      </Density>
    </Display>
  );
}

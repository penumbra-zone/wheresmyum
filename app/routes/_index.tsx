import { Jsonified } from "@penumbra-zone/types/jsonified";
import { Density } from "@penumbra-zone/ui/Density";
import { Display } from "@penumbra-zone/ui/Display";
import { Table } from "@penumbra-zone/ui/Table";
import { Text } from "@penumbra-zone/ui/Text";
import { ValueViewComponent } from "@penumbra-zone/ui/ValueView";
import { CopyToClipboardButton } from "@penumbra-zone/ui/CopyToClipboardButton";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import {
  Transfer,
  TransfersRequest,
  TransfersResponse,
} from "protobuf/gen/protobuf/proto/v1/wheresmyum_pb";
import testServiceClient from "~/server/grpc/wmuServiceClient";
import Timestamp from "~/components/Timestamp";
import AddressComponent from "~/components/AddressComponent";

const TransferRow = ({ transfer }: { transfer: Transfer }) => {
  if (!transfer.timestamp) {
    throw new Error("missing timestamp in transfer");
  }
  const sender = transfer?.transfer?.sender;
  if (!sender) {
    throw new Error("missing sender in transfer");
  }
  const receiver = transfer?.transfer?.receiver;
  if (!receiver) {
    throw new Error("missing receiver in transfer");
  }

  return (
    <Table.Tr>
      <Table.Td>
        <ValueViewComponent valueView={transfer.value} />
      </Table.Td>
      <Table.Td>
        <AddressComponent address={sender} />
      </Table.Td>
      <Table.Td>
        <span className="flex gap-x-2">
          <Text technical>{receiver}</Text>
          <CopyToClipboardButton text={receiver} />
        </span>
      </Table.Td>
      <Table.Td>
        <Text>
          {transfer?.transfer?.meta?.channel}/
          {transfer?.transfer?.meta?.sequence?.toString()}
        </Text>
      </Table.Td>
      <Table.Td>
        <Timestamp timestamp={transfer.timestamp} />
      </Table.Td>
    </Table.Tr>
  );
};

const ShowTransfers = ({ transfers }: { transfers: Transfer[] }) => {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Value</Table.Th>
          <Table.Th>From</Table.Th>
          <Table.Th>To</Table.Th>
          <Table.Th>Packet</Table.Th>
          <Table.Th>Time</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {transfers.map((x, i) => (
          <TransferRow key={i} transfer={x} />
        ))}
      </Table.Tbody>
    </Table>
  );
};

export const loader = async (): Promise<TransfersRequest> => {
  return await testServiceClient.transfers(new TransfersRequest());
};

export const meta: MetaFunction = () => {
  return [{ title: "Where's My Um?" }];
};

export default function Index() {
  const raw = useLoaderData<Jsonified<TransfersResponse>>();
  const resp = TransfersResponse.fromJson(raw);
  return (
    <Display>
      <Density compact>
        <ShowTransfers transfers={resp.transfers} />
      </Density>
    </Display>
  );
}

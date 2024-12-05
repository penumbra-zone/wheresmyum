import { createPromiseClient, createRouterTransport } from "@bufbuild/connect";
import { Amount } from "@penumbra-zone/protobuf/penumbra/core/num/v1/num_pb";
import { WmuService } from "protobuf/gen/protobuf/proto/v1/wheresmyum_connect";
import { splitLoHi } from "@penumbra-zone/types/lo-hi";
import {
  TransfersRequest,
  TransfersResponse,
  Transfer,
} from "protobuf/gen/protobuf/proto/v1/wheresmyum_pb";
import { db } from "../database";
import { Timestamp } from "@bufbuild/protobuf";
import { TransactionId } from "@penumbra-zone/protobuf/penumbra/core/txhash/v1/txhash_pb";
import {
  EventOutboundFungibleTokenTransfer,
  FungibleTokenTransferPacketMetadata,
} from "@penumbra-zone/protobuf/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
import {
  AssetId,
  Value,
  ValueView,
  ValueView_KnownAssetId,
  ValueView_UnknownAssetId,
} from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { Address } from "@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb";
import registry from "../registry";

const viewValue = (value: Value): ValueView => {
  const metadata = value.assetId && registry.getMetadata(value.assetId);
  if (metadata) {
    return new ValueView({
      valueView: {
        case: "knownAssetId",
        value: new ValueView_KnownAssetId({ amount: value.amount, metadata }),
      },
    });
  }
  return new ValueView({
    valueView: {
      case: "unknownAssetId",
      value: new ValueView_UnknownAssetId({ ...value }),
    },
  });
};

const transfers = async (
  _req: TransfersRequest,
): Promise<TransfersResponse> => {
  const query = await db
    .selectFrom("wmu_transfers")
    .innerJoin("block_details", "block_details.height", "wmu_transfers.height")
    .orderBy("wmu_transfers.rowid desc")
    .limit(10)
    .selectAll()
    .execute();
  const transfers = query.map((x) => {
    console.log(x);
    const value = new Value({
      assetId: new AssetId({ inner: x.asset_id }),
      amount: new Amount(splitLoHi(BigInt(x.amount))),
    });
    return new Transfer({
      height: x.height,
      timestamp: Timestamp.fromDate(x.timestamp),
      tx: x.tx && new TransactionId({ inner: x.tx }),
      transfer: new EventOutboundFungibleTokenTransfer({
        sender: new Address({ inner: x.sender }),
        receiver: x.receiver,
        value,
        meta: new FungibleTokenTransferPacketMetadata({
          channel: x.channel,
          sequence: x.sequence,
        }),
      }),
      value: viewValue(value),
    });
  });
  return new TransfersResponse({ transfers });
};

const transport = createRouterTransport(({ service }) => {
  service(WmuService, {
    transfers,
  });
});

export default createPromiseClient(WmuService, transport);

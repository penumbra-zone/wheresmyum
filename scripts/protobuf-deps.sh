#!/usr/bin/env bash
# Build script to edit the Buf-generated Typescript files for Penumbra protos,
# to use the special namespace for Buf typescript packages. An example of the
# intended edit as a diff:
#
#   --- a/protobuf/gen/protobuf/proto/v1/wheresmyum_pb.ts
#   +++ b/protobuf/gen/protobuf/proto/v1/wheresmyum_pb.ts
#   @@ -5,9 +5,9 @@
#
#   import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
#   import { Message, proto3, protoInt64, Timestamp } from "@bufbuild/protobuf";
#   -import { EventOutboundFungibleTokenTransfer } from "../../../penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
#   -import { TransactionId } from "../../../penumbra/core/txhash/v1/txhash_pb";
#   -import { ValueView } from "../../../penumbra/core/asset/v1/asset_pb";
#   +import { EventOutboundFungibleTokenTransfer } from "@penumbra-zone/protobuf/penumbra/core/component/shielded_pool/v1/shielded_pool_pb";
#   +import { TransactionId } from "@penumbra-zone/protobuf/penumbra/core/txhash/v1/txhash_pb";
#   +import { ValueView } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
#
#   /**
#
set -euo pipefail


find protobuf/gen -type f -exec \
  sed -i "s|\(\.\./\)*penumbra|@penumbra-zone/protobuf/penumbra|g" {} +;

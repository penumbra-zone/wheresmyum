import { createPromiseClient, createRouterTransport } from "@bufbuild/connect";
import { Amount } from "@penumbra-zone/protobuf/penumbra/core/num/v1/num_pb";
import { TestService } from "protobuf/gen/protobuf/proto/v1/wheresmyum_connect";
import { splitLoHi } from "@penumbra-zone/types/lo-hi";
import {
  TestRequest,
  TestResponse,
} from "protobuf/gen/protobuf/proto/v1/wheresmyum_pb";

const transport = createRouterTransport(({ service }) => {
  service(TestService, {
    async test(_req: TestRequest): Promise<TestResponse> {
      return new TestResponse({
        msgs: [new Amount(splitLoHi(100n)), new Amount(splitLoHi(200n))],
      });
    },
  });
});

export default createPromiseClient(TestService, transport);

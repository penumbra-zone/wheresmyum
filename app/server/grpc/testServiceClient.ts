import { createPromiseClient, createRouterTransport } from "@bufbuild/connect";
import { TestService } from "protobuf/gen/protobuf/proto/v1/wheresmyum_connect";
import {
  TestRequest,
  TestResponse,
} from "protobuf/gen/protobuf/proto/v1/wheresmyum_pb";

const transport = createRouterTransport(({ service }) => {
  service(TestService, {
    async test(_req: TestRequest): Promise<TestResponse> {
      return new TestResponse({ msgs: ["hello", "world", "goodbye"] });
    },
  });
});

export default createPromiseClient(TestService, transport);

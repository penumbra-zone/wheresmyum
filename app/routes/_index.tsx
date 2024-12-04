import { Jsonified } from "@penumbra-zone/types/jsonified";
import { Density } from "@penumbra-zone/ui/Density";
import { Display } from "@penumbra-zone/ui/Display";
import { Text } from "@penumbra-zone/ui/Text";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import {
  TestRequest,
  TestResponse,
} from "protobuf/gen/protobuf/proto/v1/wheresmyum_pb";
import testServiceClient from "~/server/grpc/testServiceClient";

export const loader = async (): Promise<TestResponse> => {
  return await testServiceClient.test(new TestRequest());
};

export const meta: MetaFunction = () => {
  return [{ title: "Where's My Um?" }];
};

export default function Index() {
  const raw = useLoaderData<Jsonified<TestResponse>>();
  const resp = TestResponse.fromJson(raw);
  return (
    <Display>
      <Density compact>
        {resp.msgs.map((x, i) => (
          <Text p color="text.primary" key={i}>
            {x}
          </Text>
        ))}
      </Density>
    </Display>
  );
}

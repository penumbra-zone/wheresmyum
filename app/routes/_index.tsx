import { Jsonified } from "@penumbra-zone/types/jsonified";
import { Density } from "@penumbra-zone/ui/Density";
import { Display } from "@penumbra-zone/ui/Display";
import { Text } from "@penumbra-zone/ui/Text";
import { MetaFunction, useLoaderData } from "@remix-run/react";

export const loader = async (): Promise<string> => {
  return "hello world!";
};

export const meta: MetaFunction = () => {
  return [{ title: "Where's My Um?" }];
};

export default function Index() {
  const raw = useLoaderData<Jsonified<string>>();
  return (
    <Display>
      <Density compact>
        <Text h1 color="text.primary">
          {raw}
        </Text>
      </Density>
    </Display>
  );
}

import { Timestamp } from "@bufbuild/protobuf";
import { Text } from "@penumbra-zone/ui/Text";

export default ({ timestamp }: { timestamp: Timestamp }) => {
  const date = timestamp.toDate();
  return <Text>{date.toISOString()}</Text>;
};

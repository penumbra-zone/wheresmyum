import { ChainRegistryClient } from "@penumbra-labs/registry";

export default await new ChainRegistryClient().remote.get("penumbra-1");

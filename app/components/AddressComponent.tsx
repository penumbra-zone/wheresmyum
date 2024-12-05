import {
  Address,
  AddressView,
  AddressView_Opaque,
} from "@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb";
import { AddressViewComponent } from "@penumbra-zone/ui/AddressView";

export default ({ address }: { address: Address }) => {
  const addressView = new AddressView({
    addressView: {
      case: "opaque",
      value: new AddressView_Opaque({ address }),
    },
  });

  return <AddressViewComponent addressView={addressView} copyable />;
};

import { TransactionId } from "@penumbra-zone/protobuf/penumbra/core/txhash/v1/txhash_pb";
import { k12 } from "@noble/hashes/sha3-addons";
import { Tooltip, TooltipProvider } from "@penumbra-zone/ui/Tooltip";
import { bytesToHex } from "@noble/hashes/utils";

// data -> 64 bit hash -> 16 4bit hue values -> 16 floats in [0, 1]
const fingerprintToHues = (data: Uint8Array): number[] => {
  const hash = k12(data, { dkLen: 8 });
  const out: number[] = [];
  for (const b of hash) {
    out.push((b & 0xf) / 0xf);
    out.push(((b >> 4) & 0xf) / 0xf);
  }
  return out;
};

const PixelGrid = ({ hues }: { hues: number[] }) => {
  const S = 0.8;
  const L = 0.5;
  const padded = hues.concat(Array(16).fill(0.0)).slice(0, 16);
  const values = padded.map((h, i) => ({
    x: i % 4,
    y: Math.floor(i / 4),
    h,
    key: i,
  }));
  return (
    <svg viewBox="0 0 4 4" width="1.5em" height="1.5em">
      {values.map((v) => (
        <rect
          key={v.key}
          width="1"
          height="1"
          x={v.x}
          y={v.y}
          fill={`hsl(${v.h * 360}, ${S * 100}%, ${L * 100}%)`}
        />
      ))}
    </svg>
  );
};

export default ({ transactionId }: { transactionId: TransactionId }) => {
  const bytes = transactionId.inner;
  return (
    <TooltipProvider>
      <Tooltip message={bytesToHex(bytes)}>
        <PixelGrid hues={fingerprintToHues(bytes)} />
      </Tooltip>
    </TooltipProvider>
  );
};

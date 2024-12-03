import { withPenumbra } from '@penumbra-zone/ui/theme';

export default withPenumbra({
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    './node_modules/@penumbra-zone/ui/**/*.{js,ts,jsx,tsx,mdx,css}',
  ],
  theme: {},
  plugins: [],
});

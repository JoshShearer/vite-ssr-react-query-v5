import type { Config, ConfigEnv } from "vike/types";

// https://vike.dev/config
export default {
  passToClient: [
    "pageProps",
  ],
  clientRouting: true,
  hydrationCanBeAborted: true,
  prerender: false,
  // https://vike.dev/meta
  meta: {
    
  },
} satisfies Config;

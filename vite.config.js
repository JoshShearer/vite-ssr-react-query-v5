import react from "@vitejs/plugin-react-swc"
import path from "path";
import ssr from 'vike/plugin'

export default {
  plugins: [react(), ssr({ prerender: false })],
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "./src"),
      "#root": __dirname,
    },
  },
}

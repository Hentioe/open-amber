import bunPluginPino from "bun-plugin-pino";

await Bun.build({
  entrypoints: ["./src/main.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
  plugins: [
    bunPluginPino({
      transports: ["pino-pretty"],
    }),
  ],
});

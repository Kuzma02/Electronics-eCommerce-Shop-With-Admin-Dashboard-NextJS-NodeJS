// Registers the ts-node loader so CommonJS entry points (app.js and the
// standalone `node server/**/*.js` scripts/tests) can require the canonical
// TypeScript DB module, utills/db.ts. transpileOnly keeps startup fast and
// avoids failing on unrelated type errors; inline compilerOptions make it
// independent of the directory the process is launched from.
//
// Require this FIRST, before any `require("../utills/db")`.
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    target: "ES2019",
    esModuleInterop: true,
    skipLibCheck: true,
  },
});

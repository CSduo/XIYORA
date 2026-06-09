/**
 * Vercel Serverless Entry Point
 *
 * Imports the pre-built Express app from the esbuild output (dist/app.mjs).
 * esbuild compiles src/app.ts with lenient settings — no TypeScript
 * strict-extension or type errors that Vercel's tsc would surface.
 *
 * Built by: pnpm --filter @workspace/api-server run build
 * Output:   artifacts/api-server/dist/app.mjs
 */
export { default } from "../artifacts/api-server/dist/app.mjs";

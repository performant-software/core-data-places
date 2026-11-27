import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import { GitHubProvider } from './git-provider';
import MongodbLevel from 'mongodb-level'

try { process.loadEnvFile() } catch {}

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default isLocal
  // TINA_DATALAYER_PORT moves the local datalayer off its default port
  // (9000). Tina's --datalayer-port flag moves only the server; this client
  // must follow, or local dev hangs at "Indexing local files". Set by
  // pstudio workspaces so two sites can run side by side.
  ? createLocalDatabase(
    process.env.TINA_DATALAYER_PORT
      ? { port: Number(process.env.TINA_DATALAYER_PORT) }
      : undefined
  )
  : createDatabase({
    gitProvider: new GitHubProvider({
      branch,
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
    }),
    databaseAdapter: new MongodbLevel.MongodbLevel<string, Record<string, unknown>>({
      collectionName: process.env.MONGODB_COLLECTION_NAME || `${process.env.GITHUB_REPO}-${branch}`,
      dbName: process.env.MONGODB_NAME!,
      mongoUri: process.env.MONGODB_URI!,
    })
  });
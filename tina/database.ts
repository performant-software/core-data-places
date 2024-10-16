import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { MongodbLevel } from "./db-provider";
import { GitHubProvider } from "./git-provider";
import dotenv from "dotenv";

dotenv.config();

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
    gitProvider: new GitHubProvider({
      branch,
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
    }),
    databaseAdapter: new MongodbLevel<string, Record<string, unknown>>({
      collectionName: `${process.env.GITHUB_REPO}-${branch}`,
      dbName: process.env.MONGODB_NAME!,
      mongoUri: process.env.MONGODB_URI!,
    })
  });
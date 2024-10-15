import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import ServerlessHttp from "serverless-http";
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from "tinacms-authjs";

import { databaseClient } from "../../tina/__generated__/databaseClient";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const tinaBackend = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
      authOptions: TinaAuthJSOptions({
        databaseClient,
        secret: process.env.NEXTAUTH_SECRET!,
        debug: true,
      }),
    }),
  databaseClient,
});

app.post("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});

app.get("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});

export const handler = ServerlessHttp(app);
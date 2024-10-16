import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createMediaHandler } from "next-tinacms-cloudinary/dist/handlers";
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
const authProvider = isLocal
  ? LocalBackendAuthProvider()
  : AuthJsBackendAuthProvider({
    authOptions: TinaAuthJSOptions({
      databaseClient,
      secret: process.env.NEXTAUTH_SECRET!,
      debug: true
    })
  });

const tinaBackend = TinaNodeBackend({
  authProvider,
  databaseClient
});

const mediaHandler = createMediaHandler({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  authorized: async (req, _res) => {
    const { isAuthorized } = await authProvider.isAuthorized(req, _res);
    return isAuthorized;
  }
});

app.post("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});

app.get("/api/tina/*", async (req, res) => {
  tinaBackend(req, res);
});

app.get("/api/cloudinary/media", mediaHandler);

app.post("/api/cloudinary/media", mediaHandler);

app.delete("/api/cloudinary/media/:media", (req, res) => {
  req.query.media = ['media', req.params.media]
  return mediaHandler(req, res);
});

export const handler = ServerlessHttp(app);
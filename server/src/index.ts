import "dotenv/config";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import { appContext } from "./types";

// Declaration merging
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-session/index.d.ts#L23
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

require("dotenv").config();

const RedisStore = connectRedis(session);
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

const main = async () => {
  // ORM & Migrations setup
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  // Configure redis session
  app.use(
    session({
      name: "scok",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24h cookie
        httpOnly: true,
        secure: __prod__, // HTTPS only
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SECRET as string,
      resave: false,
    })
  );

  // Configure apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): appContext => ({
      em: orm.em,
      req,
      res,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], // Graphql playground landingpage
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server listening to port:4000");
  });
};

main().catch((err) => {
  console.error(err);
});

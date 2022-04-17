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

require("dotenv").config();

const main = async () => {
  // ORM & Migrations setup
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
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

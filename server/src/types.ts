import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { SqlEntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Response, Request } from "express";

export type appContext = {
  em: SqlEntityManager<PostgreSqlDriver> &
    EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};

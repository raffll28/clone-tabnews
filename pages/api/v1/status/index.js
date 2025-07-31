import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(gethandler);

export default router.handler(controller.errorHandlers);

async function gethandler(request, response) {
  const updateAt = new Date().toISOString();

  const versionPostgresJson = await database.query("SHOW server_version;");
  const versionPostgres = versionPostgresJson.rows[0].server_version;

  const maxConnectionJson = await database.query("SHOW max_connections;");
  const maxConnection = Number(maxConnectionJson.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const activeConnectionsJson = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const activeConnections = activeConnectionsJson.rows[0].count;

  const map = {
    update_at: updateAt,
    dependencies: {
      database: {
        version_postgres: versionPostgres,
        max_connections: maxConnection,
        active_connections: activeConnections,
      },
    },
  };
  response.status(200).json(map);
}

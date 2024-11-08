import database from "infra/database.js";

async function status(request, response) {
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
  //console.log(map);
}

export default status;

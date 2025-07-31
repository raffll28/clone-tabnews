import { Client } from "pg";
import { ServiceError } from "./error";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro de conexão com bando ou na Query.",
      cause: error,
    });

    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

function getSSL() {
  return process.env.NODE_ENV == "production" ? true : false;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSL(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;

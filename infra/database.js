import { Client } from "pg";

async function query(queryObject) {
  const creden = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  };
  const client = new Client(creden);
  console.log(creden);
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch {
    console.log("Erro na query");
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

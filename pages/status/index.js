import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <Info />
    </>
  );
}

function Info() {
  const { isLoading, data, error } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let updatedAtText = "Carregando...";
  let postgresVersion = "Carregando...";
  let maxConnections = "Carregando...";
  let openedConnections = "Carregando...";

  if (!isLoading && data && !error) {
    updatedAtText = new Date(data.update_at).toLocaleString("pt-BR");
    postgresVersion = data.dependencies.database.version_postgres;
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.active_connections;
  }

  return (
    <>
      <p>Ultima atualização: {updatedAtText}</p>
      <p>Versão do Postgres: {postgresVersion}</p>
      <p>Maximo de conexões: {maxConnections}</p>
      <p>Conexões Abertas: {openedConnections}</p>
    </>
  );
}

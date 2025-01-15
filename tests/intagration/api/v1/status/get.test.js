import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.update_at).toBeDefined();

  const parseUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parseUpdateAt);

  expect(responseBody.dependencies.database.version_postgres).toBeDefined();
  expect(typeof responseBody.dependencies.database.version_postgres).toBe(
    "string",
  );
  expect(responseBody.dependencies.database.version_postgres).toBe("16.0");

  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(typeof responseBody.dependencies.database.max_connections).toBe(
    "number",
  );
  expect(responseBody.dependencies.database.max_connections).toBe(100);

  expect(responseBody.dependencies.database.active_connections).toBeDefined();
  expect(typeof responseBody.dependencies.database.active_connections).toBe(
    "number",
  );
  expect(responseBody.dependencies.database.active_connections).toEqual(1);
  expect(
    responseBody.dependencies.database.active_connections,
  ).toBeLessThanOrEqual(responseBody.dependencies.database.max_connections);
});

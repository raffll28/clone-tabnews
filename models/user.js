import database from "infra/database.js";
import { ValidationError } from "infra/error.js";

async function create(userInputValues) {
  await validatedUniqueUsername(userInputValues.username);
  await validatedUniqueEmail(userInputValues.email);

  const newuser = await runInsertQuery(userInputValues);
  return newuser;

  async function validatedUniqueUsername(username) {
    const results = await database.query({
      text: `
    SELECT 
      username
    FROM
      users
    WHERE
      LOWER(username) = LOWER($1)
    ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já esta sendo utilizado.",
        action: "Utilize outro username para realizar o seu cadastro.",
      });
    }

    return results.rows[0];
  }

  async function validatedUniqueEmail(email) {
    const results = await database.query({
      text: `
    SELECT 
      email
    FROM
      users
    WHERE
      LOWER(email) = LOWER($1)
    ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já esta sendo utilizado.",
        action: "Utilize outro email para realizar o seu cadastro.",
      });
    }

    return results.rows[0];
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
    INSERT INTO 
      users (username,email,password) 
    VALUES 
      ($1,$2,$3)
    RETURNING
      *
    ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;

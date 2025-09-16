import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/error.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
    SELECT 
      *
    FROM
      users
    WHERE
      LOWER(username) = LOWER($1)
    LIMIT
      1
    ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username esta digitado corretamente",
      });
    }

    return results.rows[0];
  }
}
async function findOneByEmail(email) {
  const userFound = await runSelectQuery(email);

  return userFound;

  async function runSelectQuery(email) {
    const results = await database.query({
      text: `
    SELECT 
      *
    FROM
      users
    WHERE
      LOWER(email) = LOWER($1)
    LIMIT
      1
    ;`,
      values: [email],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O email informado não foi encontrado no sistema",
        action: "Verifique se o email esta digitado corretamente",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validatedUniqueUsername(userInputValues.username);
  await validatedUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newuser = await runInsertQuery(userInputValues);
  return newuser;

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

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if (
    "username" in userInputValues &&
    username.toLowerCase() !== userInputValues.username.toLowerCase()
  ) {
    await validatedUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validatedUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      `,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });

    return results.rows[0];
  }
}

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
      action: "Utilize outro username para realizar esta operação.",
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
      action: "Utilize outro email para realizar esta operação.",
    });
  }

  return results.rows[0];
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
  findOneByEmail,
};

export default user;

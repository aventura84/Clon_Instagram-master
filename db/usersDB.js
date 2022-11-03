const bcrypt = require("bcrypt");
const { generateError } = require("../helpers");
const { getConnection } = require("./db");

const createUser = async (email, password) => {
  let connection;

  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
    SELECT id FROM users WHERE email = ?
    `,
      [email]
    );

    if (user.length > 0) {
      throw generateError(
        "El usuario ya esta registrado con anterioridad",
        409
      );
    }

    const encryptPwd = await bcrypt.hash(password, 8);
    const [newUser] = await connection.query(
      `
    INSERT INTO users (email, password) VALUES (?, ?)
    `,
      [email, encryptPwd]
    );

    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const getUserById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
        SELECT id, email,created_at FROM users WHERE id=?
        `,
      `
        SELECT photo, text, created_at FROM photos WHERE user_id=?
        `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(
        "No hay ningun usuario que coincida con la busqueda",
        404
      );
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getUserByemail = async (email) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
          SELECT * FROM users WHERE email=?
          `,
      [email]
    );

    if (result.length === 0) {
      throw generateError("No hay ningun usuario con ese email", 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByemail,
};

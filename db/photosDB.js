const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const getAllPhotos = async () => {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(`
    SELECT * FROM photos ORDER BY created_at DESC
    `);
    return result;
  } finally {
    if (connection) connection.release();
  }
};

const getPhotosByText = async (text) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
          SELECT * FROM users WHERE text=?
          `,
      [text]
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
  getAllPhotos,
  getPhotosByText,
};

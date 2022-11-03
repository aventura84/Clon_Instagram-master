const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const deteleTweetById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
      DELETE FROM posts WHERE id = ?
    `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

const getPostById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM tweets WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El post con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getAllPosts = async () => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(`
      SELECT * FROM post ORDER BY created_at DESC
    `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createPost = async (userId, text, image = '') => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      INSERT INTO tweets (user_id, text, image)
      VALUES(?,?,?)
    `,
      [userId, text, image]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deteleTweetById,
};

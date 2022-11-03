const { getConnection } = require('./db');

async function initDB() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS posts');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS likes');

    console.log('Creando tablas');
    await connection.query(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER UNIQUE NULL,
        text VARCHAR (200) NOT NULL,
        image VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await connection.query(`
       CREATE TABLE likes (
         id INT PRIMARY KEY AUTO_INCREMENT,
         user_id INT NOT NULL,
         post_id INT NOT NULL,
         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
       );
     `);

    // Create foreign keys
    await connection.query(`
      ALTER TABLE posts ADD FOREIGN KEY (user_id) REFERENCES users(id);
    `);
    await connection.query(`
      ALTER TABLE likes ADD FOREIGN KEY (user_id) REFERENCES users(id);
    `);
    await connection.query(`
      ALTER TABLE likes ADD FOREIGN KEY (post_id) REFERENCES posts(id);
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();

    process.exit();
  }
}

initDB();

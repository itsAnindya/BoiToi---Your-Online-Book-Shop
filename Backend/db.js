const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysqlServer#9971',
  database: 'BoiToi_DB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
// This code creates a connection pool to a MySQL database using the mysql2 library.
// The pool is configured with the database connection details such as host, user, password, and database name.
// The pool allows for multiple connections to be managed efficiently, with options for waiting for connections and limiting the number of connections.
// The pool is exported for use in other parts of the application, allowing for easy access to the database connection.
// The connection pool is created using the createPool method from the mysql2 library.
// The pool is configured with the following options:
// - host: The hostname of the MySQL server (in this case, 'localhost').
// - user: The username to connect to the MySQL server (in this case, 'root').
// - password: The password for the MySQL user (in this case, 'mysqlServer#9971').
// - database: The name of the database to connect to (in this case, 'BoiToi_DB').
// - waitForConnections: A boolean indicating whether to wait for a connection to be available (in this case, true).
// - connectionLimit: The maximum number of connections to create at once (in this case, 10).
// - queueLimit: The maximum number of connection requests that can be queued (in this case, 0, meaning no limit).
// The pool is exported using module.exports, allowing other modules to import and use the pool for database operations.
// This code is a basic setup for connecting to a MySQL database using the mysql2 library.
// It provides a connection pool that can be used to execute queries and interact with the database.
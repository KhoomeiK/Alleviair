const { Pool } = require('pg');

/**
 * Web Server (for other GET/POST requests)
 * @param {import('express').Application} server
 */
module.exports = function (server) {
  server.get('/get_points', (req, res) => {
    const pool = new Pool({
      user: 'super',
      host: 'mydbinstance.cyzajcuo8mvf.us-east-1.rds.amazonaws.com',
      database: 'postgres',
      password: 'password',
      port: 5432
    });
    
    pool.query('SELECT * from POINTS;', (err, data) => {
      console.log(err, data);
      res.send(data.rows);
      pool.end();
    });
  });
};

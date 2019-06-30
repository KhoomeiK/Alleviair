const { Pool } = require('pg');

const pool = new Pool({
  user: 'super',
  host: 'mydbinstance.cyzajcuo8mvf.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'password',
  port: 5432
});

pool.query('SELECT * from POINTS', (err, res) => {
  console.log(err, res);
  pool.end();
});

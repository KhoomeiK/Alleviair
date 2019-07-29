const path = require('path');
const express = require('express');
const { Pool } = require('pg');

/**
 * Web Server (for other GET/POST requests)
 * @param {import('express').Application} server
 */
module.exports = function (server) {
  server.use(express.static('web'));

  server.get('/', (req, res) => {
    // res.send('Sorry, the web app is currently only available locally');
    res.sendFile(path.join(__dirname, '../web/index.html'));
  });

  server.get('/maps', (req, res) => {
    res.redirect('/dashboard');
  });
  server.get('/maps.html', (req, res) => {
    res.redirect('/dashboard');
  });

  server.get('/dashboard', (req, res) => {
    // res.send('Sorry, the web app is currently only available locally');
    res.sendFile(path.join(__dirname, '../web/dashboard.html'));
  });

  server.get('/privacy', (req, res) => {
    // res.send('Sorry, the web app is currently only available locally');
    res.sendFile(path.join(__dirname, '../web/privacy.html'));
  });

  server.get('/get_points', (req, res) => {
    const pool = new Pool({
      user: 'super',
      host: 'mydbinstance.cyzajcuo8mvf.us-east-1.rds.amazonaws.com',
      database: 'postgres',
      password: 'password',
      port: 5432
    });

    pool.query('SELECT * from POINTS;', (err, data) => {
      if (err) {
        console.error(err);
      }
      // console.log(err, data);
      res.send(data.rows);
      pool.end();
    });
  });
};

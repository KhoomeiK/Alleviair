/**
 * Web Server (for other GET/POST requests)
 * @param {import('express').Application} server
 */
module.exports = function (server) {
  server.get('/', (req, res) => {
    res.send('Hello World!');
  });
};

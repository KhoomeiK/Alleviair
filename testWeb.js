const express = require('express');
const webserver = require('./utils/webserver');

const port = process.env.port || 3000;
const app = express();

webserver(app);

app.listen(port, () => {
  console.log(`Test web server listening on port ${port}`);
});

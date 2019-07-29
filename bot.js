// This is the main file for the alleviair bot.

const path = require('path');

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for facebook.

const { FacebookAdapter, FacebookEventTypeMiddleware } = require('botbuilder-adapter-facebook');

// Import webserver for non botkit-related things
const webserver = require('./utils/webserver');

// Load process.env values from .env file
require('dotenv').config();

const adapter = new FacebookAdapter({
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
  access_token: process.env.FACEBOOK_ACCESS_TOKEN,
  app_secret: process.env.FACEBOOK_APP_SECRET
});

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};

// emit events based on the type of facebook event being received
adapter.use(new FacebookEventTypeMiddleware());

const controller = new Botkit({
  debug: true,
  webhook_uri: '/api/messages',

  adapter: adapter
});

controller.webserver.use(allowCrossDomain);

if (process.env.cms_uri) {
  controller.usePlugin(new BotkitCMSHelper({
    cms_uri: process.env.cms_uri,
    token: process.env.cms_token
  }));
}

// Call Webserver using the current express server
webserver(controller.webserver);

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
  // load traditional developer-created local custom feature modules
  controller.loadModules(path.join(__dirname, '/features'));

  /* catch-all that uses the CMS to trigger dialogs */
  if (controller.plugins.cms) {
    controller.on('message,direct_message', async (bot, message) => {
      console.log(`Message Received`, message);
      let results = false;
      results = await controller.plugins.cms.testTrigger(bot, message);

      if (results !== false) {
        // do not continue middleware!
        return false;
      }
    });
  }
});

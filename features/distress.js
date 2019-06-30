const watson = require('../utils/watsonCall');

let tempStorage;

/**
 * @param {import('botkit').Botkit} controller
 */
module.exports = async function (controller) {
  controller.on('message', async (bot, message) => {
    // If it contians an attachment
    if (message.message.attachments && message.message.attachments.length > 0) {
      // Received location data
      if (message.message.attachments[0].type === 'location') {
        const { coordinates } = message.message.attachments[0].payload;

        if (tempStorage) {
          tempStorage.coordinates = coordinates;
        }

        console.log(tempStorage);

        // TODO: Make a request to database to push "tempStorage" data through SQL
      } else {
        // Attachment but not location, unknown
        await bot.reply(message, {
          text: 'Sorry, I\'m unsure what to do with this.'
        });
      }
    } else {
      // TODO: Make a request with IBM Watson to send current 'message' data to SQL
      // -> Take 'message' pass it through your IBM Watson API and return all of the output into tempStorage
      //    (place it wherever you want inside that object.)
      // call to other file watsonCall()
      tempStorage = { message: message.text, watsonData: await watson(message.text) };

      // No attachment
      await bot.reply(message, {
        text: 'Hello. Please share your location so help can arrive as soon as possible.',
        quick_replies: [
          {
            content_type: 'location'
          }
        ]
      });
    }
  });
};

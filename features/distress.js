/**
 * @param {import('botkit').Botkit} controller
 */
module.exports = function (controller) {
  controller.on('message', async (bot, message) => {
    console.log(message.timestamp);
    await bot.reply(message, {
      text: 'Hello. Please share your location so help can arrive as soon as possible.',
      quick_replies: [
        {
          content_type: 'location'
        }
      ]
    });
  });
};

/**
 * @param {import('botkit').Botkit} controller
 */
module.exports = function (controller) {
  controller.on('facebook_postback', async (bot, message) => {
    await bot.reply(message, {
      text: 'postback'
    });
  });

  controller.on('message', async (bot, message) => {
    console.log(message);
    await bot.reply(message, {
      text: 'Hello. Please share your location so emergency services can arrive as soon as possible.',
      quick_replies: [
        {
          content_type: 'location'
        }
      ]
    });
  });
};

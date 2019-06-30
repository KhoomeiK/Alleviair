/**
 * @param {import('botkit').Botkit} controller
 */
module.exports = function (controller) {
  controller.on('facebook_postback', async (bot, message) => {
    console.log('postback');
    await bot.reply(message, 'postback');
  });

  controller.on('message', async (bot, message) => {
    console.log(JSON.stringify(message, '', '\t'));
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

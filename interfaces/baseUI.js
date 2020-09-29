const { Extra, Markup } = require('telegraf');

exports.start = (ctx) => {
  ctx.reply('Hello from Server', {
    reply_markup: { keyboard: [['Login']], one_time_keyboard: false, resize_keyboard: true },
  });
};

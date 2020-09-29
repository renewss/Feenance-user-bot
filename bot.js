const { Telegraf, Extra, Markup } = require('telegraf');
const authController = require('./controllers/authController');
const baseui = require('./interfaces/baseUI');
const authui = require('./interfaces/authUI');

const bot = new Telegraf(process.env.BOT_TOKEN, {});

bot.start(baseui.start);
bot.hears('Login', authui.login);

bot.on('text', authController.identify);
bot.on('text', authui.getToken);

bot.catch((err, ctx) => {
  console.log(err);
  ctx.reply(err.message);
});

module.exports = bot;

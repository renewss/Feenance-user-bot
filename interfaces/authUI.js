const { Extra, Markup } = require('telegraf');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios').default;

// Login proccess
// 1) Sending text and Setting state
exports.login = catchAsync(async (ctx) => {
  // Find User, or Create new if not exists
  const user = await User.findOne({ chatId: ctx.chat.id });
  if (user) {
    user.state = 'WaitingToken';
    user.save();
  } else {
    await User.create({
      chatId: ctx.chat.id,
      name: ctx.chat.first_name,
      state: 'WaitingToken',
    });
  }

  ctx.reply('Now send me token');
});

// 2) Getting Token
exports.getToken = catchAsync(async (ctx, next) => {
  if (ctx.user !== 'WaitingToken') next();
  const token = ctx.message.text;
  const apiUser = await axios.post(
    `${process.env.base_url}user/login`,
    {
      email: token,
      password: token,
    },
    {
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    }
  );
  if (apiUser.data.status !== 'success') throw new Error(apiUser.data.message);
  ctx.reply(1);
});

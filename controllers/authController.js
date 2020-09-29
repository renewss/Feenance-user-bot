const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.identify = catchAsync(async (ctx, next) => {
  const user = await User.findOne({ chatId: ctx.chat.id });
  if (!user) return next(new Error('No User'));
  ctx.user = { ...user };

  next();
});

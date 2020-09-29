module.exports = (fn) => {
  return (ctx, next) => {
    fn(ctx, next).catch((err) => {
      console.log(err);
      ctx.reply(err.message);
    });
  };
};

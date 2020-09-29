const mongoose = require('mongoose');
require('dotenv').config();
const bot = require('./bot');

const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log('Successfully connected to DB');
  }
);

bot.launch().then(() => {
  console.log(`Bot started`);
});

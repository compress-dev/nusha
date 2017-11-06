const TelegramBot = require('node-telegram-bot-api');

const token = '460908339:AAGMTxi85BuwbHjZejRm7CyVoXFDRTocRtk';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
 const chatId = msg.chat.id;
 bot.sendMessage(chatId, 'Received your message');
});
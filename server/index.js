var player = require("./classi.js");
const Telegraf = require('telegraf');
// const TelegrafInlineMenu = require('telegraf-inline-menu');

const bot = new Telegraf("988248135:AAHbsQMjyMFQjbDD8ms7AipKsoROic6EUdo");

var players = [];
var isStarted = false;

bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply('welcome in the covid-19 era');
})

bot.on('text',
  (ctx) => {
    switch (ctx.message.text) {

      case "/join": //idea di creare più partite e dividerle per nome in modo da sciegliere in quale entrare

        if (!isStarted) {
          var isNew = players.findIndex((element) => element.id == ctx.chat.id) == -1;
          if (isNew) {
            for (let p of players) {
              ctx.telegram.sendMessage(p.id, `${ctx.chat.username} has joined the game!`)
            }
            players.push(new player(ctx.chat.id, ctx.chat.username));
            ctx.reply('joined!');
          }
          else {
            ctx.reply('you are alredy in the game!');
          }
        }
        else{
          ctx.reply('sorry, game is alredy started');
        }

      break;

      case "/startgame":
        for (let p of players) {
          ctx.telegram.sendMessage(p.id, 'the game has started');
        }
        isStarted = true;
      break;

      default:
        ctx.reply("sorry I don't understand your request");
      break;
    }
    console.log(ctx.message);
    console.log(players)
  })


bot.launch();
bot.startPolling();
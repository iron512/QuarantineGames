var player = require("./classi.js");
const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');

var players = [];
var isStarted = false;

const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}! Welcome in the COVID-19 era`)

menu.simpleButton('join game', 'a', {
  doFunc: ctx => {
    joinGame(ctx);
  }
})

menu.setCommand('start')

const bot = new Telegraf("1102153334:AAE9u_2HoJBs175nuILa9HqW_NL7LnPll7U");
//988248135:AAHbsQMjyMFQjbDD8ms7AipKsoROic6EUdo

bot.use(menu.init())

bot.on('text',
  (ctx) => {
    switch (ctx.message.text) {

      case "/join": //idea di creare più partite e dividerle per nome in modo da sciegliere in quale entrare
        joinGame(ctx);
        break;

      case "/startgame":
        sendToEveryone(ctx, 'the game has started');
        isStarted = true;
        break;

      default:
        ctx.reply("sorry I don't understand your request");
        break;
    }
    console.log(ctx.message);
  })


bot.launch();
bot.startPolling();

function joinGame(ctx) {
  var isNew = players.findIndex((element) => element.id == ctx.chat.id) == -1;
  if (isNew) {
    sendToEveryone(ctx, `${ctx.chat.username} has joined the game!`)
    players.push(new player(ctx.chat.id, ctx.chat.username));
    ctx.reply('joined!');
  }
  else {
    ctx.reply('you are alredy in the game!');
  }
}

function sendToEveryone(ctx, message) {
  for (let p of players) {
    ctx.telegram.sendMessage(p.id, message);
  }
}
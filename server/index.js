var player = require("./classi.js");
const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');

var role = { good: 0, bad: 1 };
var players = [];
var isStarted = false;

const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}! Welcome in the COVID-19 era`)

menu.simpleButton('join game', 'a', {
  doFunc: ctx => {
    joinGame(ctx);
  }
})

menu.setCommand('start')

var bots ={
  quarantineDev: "988248135:AAHbsQMjyMFQjbDD8ms7AipKsoROic6EUdo",
  martino: "1102153334:AAE9u_2HoJBs175nuILa9HqW_NL7LnPll7U"
}

const bot = new Telegraf(bots.martino);

bot.use(menu.init())

bot.on('text',
  (ctx) => {
    switch (ctx.message.text) {

      case "/join": //idea di creare più partite e dividerle per nome in modo da sciegliere in quale entrare
        joinGame(ctx);
        break;

      case "/startgame":
        
        break;

      default:
        ctx.reply("sorry I dind't understand your request");
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
    ctx.reply('joined! waiting for other players');
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

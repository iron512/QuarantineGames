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

const bot = new Telegraf("988248135:AAHbsQMjyMFQjbDD8ms7AipKsoROic6EUdo");
//1102153334:AAE9u_2HoJBs175nuILa9HqW_NL7LnPll7U

bot.use(menu.init())

bot.on('text',
  (ctx) => {
    switch (ctx.message.text) {

      case "/join": //idea di creare più partite e dividerle per nome in modo da sciegliere in quale entrare
        joinGame(ctx);
        break;

      case "/startgame":
        var result = decideRoles();
        if (result == "decided") {
          sendToEveryone(ctx, 'the game has started');
          isStarted = true;
        }
        else {
          ctx.reply(result);
        }

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

function decideRoles() {
  if (players.length >= 5) {
    if (players.length <= 10) {
      var index = 0;
      while (index < players.length / 2) {
        players[index].role = role.good;
        index++;
      }
      while (index < player.length) {
        players[index].role = role.good;
        index++;
      }
      return "decided";
    }
    else {
      return "too much players, must be no more than 10!";
    }
  }
  else {
    return "you have to be at least 5 players";
  }
}
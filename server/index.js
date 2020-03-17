var player = require("./classi.js");
var SelectPlayers = require('./selectPlayers');

const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')

const menu = new TelegrafInlineMenu()
menu.setCommand('sP')

let mainMenuToggle = false

menu.toggle('toggle me', 'a', {
  setFunc: (_ctx, newVal) => {
    mainMenuToggle = newVal
  },
  isSetFunc: () => mainMenuToggle
})


const player = require("./classi.js");

bot.use(menu.init())




var players = [];
var isStarted = false;

bot.start((message) => {
	console.log('started:', message.from.id)
	return message.reply('Welcome in the covid-19 era');
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
        var str = ctx.message.text
        if(str.charAt(0) == '§'){
          str = str.substring(1)
          for(let p of players){
            if(p.id == str){
              p.selected = true
            }
          }
        }
        else{
          ctx.reply("sorry I don't understand your request");
        }
      break;
    }
    console.log(ctx.message);
    console.log(players)
  })


bot.launch();
bot.startPolling();

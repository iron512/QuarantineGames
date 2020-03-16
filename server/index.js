var player = require("./classi.js");
var selectPlayers = require('./selectPlayers');

const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')

const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`)
menu.setCommand('sP')

let mainMenuToggle = false
const selectPlayers = new TelegrafInlineMenu ()
.toggle('toggle me', 'a', {
  setFunc: (_ctx, newVal) => {
    mainMenuToggle = newVal
    selectPlayers(menu, _ctx)
  },
  isSetFunc: () => mainMenuToggle
})

menu.selectSubmenu('p', players )

const player = require("./classi.js");

const bot = new telegraf(privacy.token);

var state = "create" // create | setup | active
var phase = "null" //squad | votation | mission
var successes = 0
var failures = 0 
var leader = -1
var chosen = 0

var currentMission = 0;

//Numero giocatori: 5-10
var players = [ 
				//	/*
				{name:"1 Ivan Martini", id:178877328, role:"null", choice:false},
				{name:"2 Martino Papa", id:400148831, role:"null", choice:false},
				{name:"3 Ivaneiro Martinez", id:178877328, role:"null", choice:false}, 
				{name:"4 Ivanov Von Martenstein", id:178877328, role:"null", choice:false},
				{name:"5 Martin MacPapus", id:400148831, role:"null", choice:false},
				{name:"6 Martinos Juan de lo Papa", id:400148831, role:"null", choice:false},
				//	*/
			]

var roles = [	
				{doctors:3, infectors:2},  //5 players
				{doctors:4, infectors:2},  //6 players
				{doctors:4, infectors:3},  //7 players
				{doctors:5, infectors:3},  //8 players
				{doctors:6, infectors:3},  //9 players
				{doctors:6, infectors:4}   //10 players
			]

var missions = [
				{name:"Milano",members:[2,2,2,3,3,3]},
				{name:"Vicenza",members:[3,3,3,4,4,4]},
				{name:"Roma",members:[2,4,3,4,4,4]},
				{name:"Napoli",members:[3,3,4,5,5,5]},
				{name:"Trento",members:[3,4,4,5,5,5]}
			]

const menu = new TelegrafInlineMenu(function(ctx) {
	if (phase == "squad" && ctx.message.from.id == players[leader].id) 
		return (players[leader].name + " you are called to nomine " + missions[currentMission].members[players.length-5] + " guys to act on" + missions[currentMission].name + "\n\nWho do you trust?")
	else 
		return ("This is not the right time for you to propose a squad")
})

menu.setCommand('selectplayers')

for (var i = players.length - 1; i >= 0; i--) {
	let current = players[i]
	let max = missions[currentMission].members[players.length-5]
	menu.toggle(current.name, i, {
		setFunc: (ctx, newVal) => {
			if(ctx.update.callback_query.from.id == players[leader].id)
				if (chosen < max) {
					current.choice = newVal

					if (newVal == true) {
						chosen++
					} else {
						chosen--
					}
				} else if (newVal == false) {
					current.choice = newVal
					chosen--
				} else {
					ctx.answerCbQuery('You have no more room for another player.')
				}
			else {
				ctx.answerCbQuery('You are not the leader.')	
			}
		},
		isSetFunc: () => current.choice,
		hide: (ctx) => phase != "squad" || ctx.message.from.id != players[leader].id
	})
}

bot.use(menu.init())

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

bot.use(menu.init())

bot.launch();
bot.startPolling();

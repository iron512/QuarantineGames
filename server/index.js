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

bot.command('help', function (ctx, next) {
	ctx.reply('Here is a list of avaible commands for you to use:\n/joingame - join the game \n/startgame - start th game\n/showplayers - list of all the current players\n/help - show commands')
});

bot.command('showplayers', function (ctx, next) {
	var msg = 'The current players are:'

	for(var i = 0; i < players.length; i++){
		msg += '\n- ' + players[i].name	
	}
	ctx.reply(msg)
});


bot.command('sp', function () {
	const menu = new TelegrafInlineMenu('select players');
	menu.select('a', ()=> Object.keys(players),{
		setFunc: async (ctx, key) => {
			selectedKey = key
			await ctx.answerCbQuery(`you selected ${key}`)
		  },
		  isSetFunc: (_ctx, key) => key === selectedKey
	})
	bot.use(menu.init())
	console.log(Object.keys(players))
});


bot.on('message', function (ctx, next) {
	console.log('message');
	for (var i = players.length - 1; i >= 0; i--) {
	}
});


bot.launch()

//FUNCTION DECLARATION
function shuffle(array) {
	var totaltimes = (Math.floor(Math.random() * 100000) % 4500 + 500)
	for (var i = totaltimes; i >= 0; i--) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}

function discussSquad(ctx) {
	currentMission++
	phase = "squad"
	ctx.reply("Ok fellas, " + players[leader].name + " is the team leader.\nWe must save " + missions[currentMission].name + " to complete the #" + (currentMission+1) + " mission and we need " + missions[currentMission].members[players.length-5] + ".")
}

//requires*
const telegraf = require('telegraf');
const privacy = require('../token.js')
const TelegrafInlineMenu = require('telegraf-inline-menu');

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

bot.command('joingame', function(ctx,next){
	if (state != "active") {
		
		var isNew = players.findIndex((element) => element.id == ctx.message.from.id) == -1;
		if (isNew) {
			players.push(new player(ctx.message.from.id, ctx.message.from.username));
			
			var answer = ""
			for (let p of players) {
			//	ctx.telegram.sendMessage(p.id, ctx.message.from.username + " has joined the game!")
				answer = answer + " * " + p.name + "\n"
			}
			
			ctx.reply(ctx.message.from.username + ' has joined the game!\n\nCurrent players are:\n' + answer);
		}
		else {
			ctx.reply('You are alredy in the game!');
		}
	}
	else{
		//ctx.reply('sorry, game is alredy started');
	}

})

bot.command('startgame', function (ctx, next) {
	if (((players.length >= 5) && (players.length <=10)) && state == "create") {
		state = "setup"
		shuffle(players)

		var setup = roles[players.length-5];
		var pickedDoctors = 0;
		var pickedInfectors = 0;

		for (var i = players.length - 1; i >= 0; i--) {
			var choice = Math.floor((Math.random() * 10000) %  ((setup.doctors - pickedDoctors) + (setup.infectors - pickedInfectors))) + 1 ;
			console.log(choice)
			if (setup.infectors == pickedInfectors){
				console.log("\tequal inf")
				players[i].role = "doctor"
				pickedDoctors++
			} else if (setup.doctors == pickedDoctors) {
				console.log("\tequal doc")
				players[i].role = "infector"
				pickedInfectors++
			} else if (choice > (setup.infectors - pickedInfectors)) {
				players[i].role = "doctor"
				pickedDoctors++
			} else {
				players[i].role = "infector"
				pickedInfectors++
			}

			console.log(players[i].name + " is a " + players[i].role);
		}
		console.log("");
		console.log("Game is set up right now. Informing partecipants of their role");
		
		var message
		for (var i = players.length - 1; i >= 0; i--) {
			if (players[i].role == "infector") {
				message = "Hi " + players[i].name + ", you have been assigned to the Infectors Squad \u{1F489}.\n\nYour other bad pals are:"

				for (var j = players.length - 1; j >= 0; j--) {
					if (players[j].role == "infector" && players[j] != players[i]) {
						message = message + "\n* " + players[j].name;			
					}
				}
				message = message + "\n\nGood luck guys, kill everyone."
			} else {
				message = "Hi " + players[i].name + ", you have been assigned to the Doctors Squad \u{1F52C}.\n\nGood luck, you are our only hope."	
			}
			bot.telegram.sendMessage(players[i].id, message)
		}
		ctx.reply("Game is starting right now.\n\nCheck you private chat to discover your role.")

		state = "active"
		phase = "squad"
		leader = 0

		startTurn(ctx)
	} else {
		ctx.reply("There are some constraints that does not allow to play")		
	}
})
	

bot.on('message', function (ctx, next) {
	console.log('message');
	for (var i = players.length - 1; i >= 0; i--) {
	}
});

bot.launch()

//function definition
function shuffle(array) {
	var totaltimes = (Math.floor(Math.random() * 100000) % 4500 + 500)
	for (var i = totaltimes; i >= 0; i--) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}

function startTurn(ctx) {
	phase = "squad"
	ctx.reply("Ok fellas, We must save " + missions[currentMission].name + " to complete the #" + (currentMission+1) + " mission.\n\n" + players[leader].name + " is the team leader and must choose " + missions[currentMission].members[players.length-5] + " people to accomplish the mission.")
}

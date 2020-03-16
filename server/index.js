const player = require("./classi.js");

const telegraf = require('telegraf');
const privacy = require('../token.js')

const bot = new telegraf(privacy.token);

var state = "create" // create | setup | active 
var currentMission = 0;

//Numero giocatori: 5-10
var players = [ 
				//	/*
				{name:"1 Ivan Martini", id:178877328, role:"null"},
				{name:"2 Martino Papa", id:400148831, role:"null"},
				{name:"3 Ivaneiro Martinez", id:178877328, role:"null"}, 
				{name:"4 Ivanov Von Martenstein", id:178877328, role:"null"},
				{name:"5 Martin MacPapus", id:400148831, role:"null"},
				{name:"6 Martinos Juan de lo Papa", id:400148831, role:"null"},
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

bot.start((message) => {
	console.log('started:', message.from.id)
	return message.reply('Welcome in the covid-19 era');
})


bot.command('joingame', function(ctx,next){
	if (state != "active") {
		
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
				message = "Hi " + players[i].name + ", you are assigned to the Infectors Squad.\n Your other bad pals are:\n"

				for (var j = players.length - 1; j >= 0; j--) {
					if (players[j].role == "infector" && players[j] != players[i]) {
						message = message + "\n" + players[j].name;			
					}
				}
				message = message + "\n\n Good luck guys, kill everyone."
			} else {
				message = "Hi " + players[i].name + ", you are assigned to the Doctors Squad.\n\nGood luck, you are our only hope."	
			}
			bot.telegram.sendMessage(players[i].id, message)
		}
		
		state = "active"
		currentMission = 1;
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
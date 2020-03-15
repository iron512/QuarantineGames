const Telegraf = require('telegraf');
const bot = new Telegraf("988248135:AAHbsQMjyMFQjbDD8ms7AipKsoROic6EUdo");

var gameActive = false

//Numero giocatori: 5-10
var users = [ 
				{name:"1 Ivan Martini", id:"178877328", role:"null"},
			 	{name:"2 Martino Papa", id:"400148831", role:"null"},
			 	{name:"3 Ivaneiro Martinez", id:"178877328", role:"null"}, 
			 	{name:"4 Ivanov Von Martenstein", id:"178877328", role:"null"},
			 	{name:"5 Martin MacPapus", id:"400148831", role:"null"},
			 	{name:"6 Martinos Juan de lo Papa", id:"400148831", role:"null"},
			]

var roles = [	
				{doctors:"3", infectors:"2"},  //5 players
				{doctors:"4", infectors:"2"},  //6 players
				{doctors:"4", infectors:"3"},  //7 players
				{doctors:"5", infectors:"3"},  //8 players
				{doctors:"6", infectors:"3"},  //9 players
				{doctors:"6", infectors:"4"}   //10 players
			]

bot.command('startgame', function (ctx, next) {
	if ((users.length >= 5) || (users.length <=10 && !gameActive)) {
		//gameActive = true;

		shuffle(users)

		var setup = roles[users.length-5];
		var pickedDoctors = 0;
		var pickedInfectors = 0;

		for (var i = users.length - 1; i >= 0; i--) {
			var choice = Math.floor((Math.random() * 10000) %  ((setup.doctors - pickedDoctors) + (setup.infectors - pickedInfectors))) + 1 ;
			console.log(choice)
			if (setup.infectors == pickedInfectors){
				console.log("equal inf")
				users[i].role = "doctor"
				pickedDoctors++
			} else if (setup.doctors == pickedDoctors) {
				console.log("equal doc")
				users[i].role = "infector"
				pickedInfectors++
			} else if (choice > (setup.infectors - pickedInfectors)) {
				users[i].role = "doctor"
				pickedDoctors++
			} else {
				users[i].role = "infector"
				pickedInfectors++
			}

			bot.telegram.sendMessage(users[i].id,"Ciao " + users[i].name + ", you are " + users[i].role)
			console.log(users[i].name + " is a " + users[i].role);
		}
		console.log("");
	}else {
		ctx.reply("There are some constraints that does not allow to ")		
	}
})


bot.on('message', function (ctx, next) {
	console.log('message');
	for (var i = users.length - 1; i >= 0; i--) {
	}
});

//bot.hears('ciao', (ctx) => ctx.reply('Pietro Merda'))
//bot.on('text', (ctx) => ctx.reply('Pietro'))

bot.launch()

function shuffle(array) {
	var totaltimes = (Math.floor(Math.random() * 100000) % 4500 + 500)
	for (var i = totaltimes; i >= 0; i--) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}
const Telegraf = require('telegraf');
const bot = new Telegraf("988248135:AAHbsQMjyMFQjbDD8ms7AipKsoROic6EUdo");

bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply('Hello my friend, porcodio non funziona');
})

bot.on('text', message=> {
	return message.reply("Ciao coglione")
})

bot.launch()
bot.startPolling();
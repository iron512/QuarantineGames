const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')

const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}! Welcome in the COVID-19 era`)

menu.setCommand('start')

menu.simpleButton('join a game', 'a', {
  doFunc: ctx => ctx.reply('/join')
})


const bot = new Telegraf("1102153334:AAE9u_2HoJBs175nuILa9HqW_NL7LnPll7U")

bot.use(menu.init())

bot.startPolling()

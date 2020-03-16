var player = require('./classi')

function Selection(menu, ctx){

    var data = []
                
    for(let p of players){
        var name = p.name
        if(p.selected){
            name += "  \u{2714}"
        }
        else{
            name += "  \u{274c}"
        }

        data.push([{ text: name, callback_data: "§" + p.id + '§' + ctx.message.message_id}])
    }

    data.push([{ text: 'Confirm squad', callback_data: 'confirmSquad' }])
    data.push([{ text: 'Unload squad', callback_data: 'resetSquad' }])


    ctx.telegram.sendMessage(ctx.chat.id, "Select your squad", {
        "reply_markup": {
            inline_keyboard: data
        }
    });
}

module.exports = Selection
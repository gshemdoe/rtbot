const rtStarterModel = require('../database/chats')

const createUser = async (ctx) => {
    try {
        let chatid = ctx.chat.id
        let username = ctx.chat.first_name
        let refferer = 'rtbot'
        let handle = 'unknown'

        if (ctx.chat.username) {
            handle = ctx.chat.username
        }

        let user = await rtStarterModel.findOne({ chatid })

        if (!user) {
            await rtStarterModel.create({
                chatid, username, handle, refferer, free: 5, paid: false, startDate: null, endDate: null
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}


const sendFreeVideo = async (ctx, delay, bot, imp, vid, upd) => {
    let url = `https://t.me/+8sYOwE1SqoFkOGY0`
    await ctx.sendChatAction('upload_video')
    await bot.telegram.copyMessage(ctx.chat.id, imp.ohmyDB, vid.msgId, {
        protect_content: true,
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "VIDEO ZAIDI - INGIA HAPA", url }
                ]
            ]
        }
    })
    await ctx.sendChatAction('typing')
    await delay(2000)
    await ctx.reply(`Umepokea Full Video bure. Umebakiwa na video <b>${upd.free}</b> kati ya video <b>5</b> za bure.`, {parse_mode: 'HTML'})
}

const sendPaidVideo = async (ctx, delay, bot, imp, vid) => {
    await ctx.sendChatAction('upload_video')
    await delay(1000)
    await bot.telegram.copyMessage(ctx.chat.id, imp.ohmyDB, vid.msgId, {
        protect_content: false,
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "MUDA ULIOBAKIA", callback_data: 'salio' }
                ]
            ]
        }
    })
}

module.exports = {
    createUser,
    sendFreeVideo,
    sendPaidVideo
}
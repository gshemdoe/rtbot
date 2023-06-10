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
                chatid, username, handle, refferer, free: 5, paid: false
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
    return await ctx.reply(`Umepokea Full Video bure. Umebakiwa na video <b>${upd.free}</b> kati ya <b>5</b> za bure.`, { parse_mode: 'HTML' })
}

const sendPaidVideo = async (ctx, delay, bot, imp, vid) => {
    await ctx.sendChatAction('upload_video')
    await delay(1000)
    return await bot.telegram.copyMessage(ctx.chat.id, imp.ohmyDB, vid.msgId, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "MUDA ULIOBAKIA", callback_data: 'salio' }
                ]
            ]
        }
    })
}

const payingInfo = async (bot, ctx, delay, imp, userid) => {
    await ctx.sendChatAction('typing')
    await delay(1500)
    await bot.telegram.copyMessage(userid, imp.matangazoDB, 7, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'M-PESA 🇹🇿', callback_data: 'voda'},
                    {text: 'Tigo Pesa 🇹🇿', callback_data: 'tigo'}
                ],
                [
                    {text: 'Airtel 🇹🇿', callback_data: 'airtel'},
                    {text: 'Halotel 🇹🇿', callback_data: 'halotel'}
                ],
                [
                    {text: '⛑ Msaada / Help ⛑', callback_data: 'help-msaada'}
                ]
            ]
        }
    })
}

module.exports = {
    createUser,
    sendFreeVideo,
    sendPaidVideo,
    payingInfo
}
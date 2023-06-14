const rtStarterModel = require('../database/chats')
const binModel = require('../database/rtbin')

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
                chatid, username, handle, refferer, paid: false, points: 500
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sendPaidVideo = async (ctx, delay, bot, imp, vid, userid) => {
    //upload video
    await ctx.sendChatAction('upload_video')
    await delay(1000)
    let dvid = await bot.telegram.copyMessage(userid, imp.ohmyDB, vid.msgId)

    //check if video sent in past 4hrs
    //if not add to duplicate and deduct 100 points
    let dup_checker = await binModel.findOne({ chatid: Number(userid), nano: vid.nano })
    if (!dup_checker) {
        await ctx.sendChatAction('typing')
        await binModel.create({ chatid: Number(userid), nano: vid.nano })

        let rcvr = await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { points: -100 } }, { new: true })
        await delay(1500)
        await ctx.reply(`Umepokea Full Video na Points 100 zimekatwa kutoka katika account yako ya RT Malipo. \n\n<b>Umebakiwa na Points ${rcvr.points}.</b>`, {
            reply_to_message_id: dvid.message_id,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [
                        { text: "💰 Points Zangu" },
                        { text: "➕ Ongeza Points" },
                    ],
                    [
                        { text: "⛑ Help / Msaada ⛑" }
                    ]
                ],
                is_persistent: true,
                resize_keyboard: true
            }
        })
    }
}

const payingInfo = async (bot, ctx, delay, imp, userid, mid) => {
    await ctx.sendChatAction('typing')
    await delay(1500)
    await bot.telegram.copyMessage(userid, imp.matangazoDB, mid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'M-PESA 🇹🇿', callback_data: 'voda' },
                    { text: 'Tigo Pesa 🇹🇿', callback_data: 'tigo' }
                ],
                [
                    { text: 'Airtel 🇹🇿', callback_data: 'airtel' },
                    { text: 'Halotel 🇹🇿', callback_data: 'halotel' }
                ],
                [
                    { text: 'SafariCom 🇰🇪', callback_data: 'safaricom' },
                    { text: 'Other 🏳️', callback_data: 'other_networks' }
                ],
                [
                    { text: '⛑ Help / Msaada ⛑', callback_data: 'help-msaada' }
                ]
            ]
        }
    })
}

module.exports = {
    createUser,
    sendPaidVideo,
    payingInfo
}
const { Telegraf } = require('telegraf')
require('dotenv').config()
const mongoose = require('mongoose')
const rtStarterModel = require('./database/chats')
const malayaModel = require('./database/malaya')
const videosDB = require('./database/db')

//Middlewares
const call_function = require('./functions/fn')


const bot = new Telegraf(process.env.BOT_TOKEN)
    .catch((err) => console.log(err.message))

mongoose.set('strictQuery', false)
mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@nodetuts-shard-00-00.ngo9k.mongodb.net:27017,nodetuts-shard-00-01.ngo9k.mongodb.net:27017,nodetuts-shard-00-02.ngo9k.mongodb.net:27017/ohmyNew?ssl=true&replicaSet=atlas-pyxyme-shard-0&authSource=admin&retryWrites=true&w=majority`)
    .then(() => {
        console.log('Bot connected to the database')
    }).catch((err) => {
        console.log(err)
        bot.telegram.sendMessage(741815228, err.message)
    })

const imp = {
    replyDb: -1001608248942,
    pzone: -1001352114412,
    rpzone: -1001549769969,
    prem_channel: -1001470139866,
    local_domain: 't.me/rss_shemdoe_bot?start=',
    prod_domain: 't.me/ohmychannelV2bot?start=',
    shemdoe: 741815228,
    halot: 1473393723,
    sh1xbet: 5755271222,
    xzone: -1001740624527,
    ohmyDB: -1001586042518,
    xbongo: -1001263624837,
    mikekaDB: -1001696592315,
    logsBin: -1001845473074,
    mylove: -1001748858805,
    malayaDB: -1001783364680,
    rtgrp: -1001899312985,
    matangazoDB: -1001570087172
}

const miamala = ['nimelipia', 'tayari', 'tayali', 'umetuma kikamilifu', 'umetuma tsh', 'you have paid', 'utambulisho wa muamala', 'confirmed. tsh', 'imethibitishwa. umelipa']
const admins = [imp.halot, imp.shemdoe]

//delaying
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

bot.start(async ctx => {
    try {
        //add to database if not
        await call_function.createUser(ctx)

        if (ctx.startPayload) {
            let pload = ctx.startPayload
            let userid = ctx.chat.id
            if (pload.includes('RTBOT-')) {
                let nano = pload.split('RTBOT-')[1]
                let vid = await videosDB.findOne({ nano })

                let user = await rtStarterModel.findOne({ chatid: userid })
                if (user.points > 99) {
                    await call_function.sendPaidVideo(ctx, delay, bot, imp, vid, userid)
                } else {
                    await call_function.payingInfo(bot, ctx, delay, imp, userid, 16)
                }
            }
            if (pload.toLowerCase() == 'verified_list') {
                await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7755, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Omba Kuongezwa kwenye List Hii', url: 'http://t.me/blackberry255' }
                            ]
                        ]
                    }
                })
            }
        }

    } catch (err) {
        console.log(err.message)
    }
})

bot.command('paid', async ctx => {
    try {
        let splitter = ctx.message.text.split('=')
        let chatid = Number(splitter[1])
        let points = Number(splitter[2])

        let upuser = await rtStarterModel.findOneAndUpdate({ chatid }, {
            $inc: { points: points },
            $set: { paid: true }
        }, { new: true })

        let txt1 = `User Points Added to ${upuser.points}`
        let txt2 = `<b>Hongera 🎉\nMalipo yako yamethibitishwa. Umepokea Points ${points} na sasa una jumla ya Points ${upuser.points} kwenye account yako ya RT Malipo.\n\nTumia points zako vizuri. Kumbuka Kila video utakayo download itakugharimu Points 100.\n\nEnjoy, ❤.</b>`

        await ctx.reply(txt1)
        await delay(2000)
        await bot.telegram.sendMessage(chatid, txt2, { parse_mode: 'HTML' })
    } catch (err) {
        console.log(err)
        await ctx.reply(err.message)
            .catch(e => console.log(e.message))
    }
})

bot.command('info', async ctx => {
    try {
        let chatid = Number(ctx.message.text.split('/info=')[1])
        let user = await rtStarterModel.findOne({ chatid })
        await ctx.reply(`User with id ${chatid} has ${user.points} Points`)
    } catch (err) {
        await ctx.reply(err.message)
    }
})

bot.command('admin', async ctx => {
    try {
        if (ctx.chat.id == imp.halot || ctx.chat.id == imp.shemdoe) {
            await ctx.reply(`/stats - stats\n/verification - post to xbongo vmessage`)
        }

    } catch (err) {
        console.log(err.message)
    }
})

bot.command('stats', async ctx => {
    try {
        let idadi = await rtStarterModel.countDocuments()
        await ctx.reply(idadi.toLocaleString('en-US') + ' members')
    } catch (err) {
        await ctx.reply(err.message)
    }
})

bot.command('salio', async ctx=> {
    try {
        let chatid = ctx.chat.id
        let inf = await rtStarterModel.findOne({chatid})
        if(inf) {
            let txt = `Habari ${ctx.chat.first_name}, \n\nUna points *${inf.points}* kwenye account yako ya RT Malipo`
            await ctx.reply(txt, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{text: '➕ Ongeza Points', callback_data: 'ongeza_points'}]]
                }
            })
        } else {await ctx.reply('Samahani! Taarifa zako hazipo kwenye kanzu data yetu.')}
    } catch (err) {
        await ctx.reply(err.message)
    }
})

bot.command('list', async ctx => {
    try {
        await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7755, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Omba Kuongezwa kwenye List Hii', url: 'http://t.me/blackberry255' }
                    ]
                ]
            }
        })
    } catch (err) {
        console.log(err.message)
    }
})

bot.command('/convo', async ctx => {
    let myId = ctx.chat.id
    let txt = ctx.message.text
    let msg_id = Number(txt.split('/convo-')[1].trim())
    if (myId == imp.shemdoe || myId == imp.halot) {
        try {
            let all_users = await rtStarterModel.find({ refferer: "rtbot" })

            all_users.forEach((u, index) => {
                if (u.blocked != true) {
                    setTimeout(() => {
                        if (index == all_users.length - 1) {
                            ctx.reply('Nimemaliza conversation')
                        }
                        bot.telegram.copyMessage(u.chatid, imp.pzone, msg_id)
                            .then(() => console.log('convo sent to ' + u.chatid))
                            .catch((err) => {
                                if (err.message.includes('blocked') || err.message.includes('initiate')) {
                                    rtStarterModel.findOneAndDelete({ chatid: u.chatid })
                                        .then(() => { console.log(u.chatid + ' is deleted') })
                                }
                            })
                    }, index * 40)
                }
            })
        } catch (err) {
            console.log(err.message)
        }
    }

})

bot.on('channel_post', async ctx => {
    try {
        let chan_id = ctx.channelPost.chat.id
        if (chan_id == imp.malayaDB && ctx.channelPost.reply_to_message) {
            let msg = ctx.channelPost.text
            let msg_id = ctx.channelPost.message_id
            let rpid = ctx.channelPost.reply_to_message.message_id
            if (msg.toLowerCase().includes('add malaya')) {
                let mkoa = msg.split('malaya - ')[1]
                let malaya_id = rpid + '-' + msg_id
                await malayaModel.create({
                    mkoa, poaId: malaya_id
                })
                let del = await ctx.reply(`Malaya posted successfully as:\nMkoa: ${mkoa}\nID: ${malaya_id}`, {
                    reply_to_message_id: rpid,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Publish This', callback_data: `push_bitch_${malaya_id}` }
                            ],
                            [
                                { text: 'Ignore', callback_data: `ignore_push` }
                            ]
                        ]
                    }
                })
            }
        }
    } catch (err) {
        console.log(err.message)
        await ctx.reply(err.message)
    }
})

bot.on('callback_query', async ctx => {
    try {
        let cdata = ctx.callbackQuery.data
        let cmsgid = ctx.callbackQuery.message.message_id
        let chatid = ctx.callbackQuery.from.id

        if (cdata == 'salio') {
            let user = await rtStarterModel.findOne({ chatid })
            let txt = `Una Points ${user.points} kwenye account yako ya RT Malipo.`
            await ctx.answerCbQuery(txt, { cache_time: 10, show_alert: true })
        } else if (cdata == 'ongeza_points') {
            await delay(250)
            await call_function.payingInfo(bot, ctx, delay, imp, chatid, 26)
        } else if (cdata == 'voda') {
            await delay(250)
            await bot.telegram.copyMessage(chatid, imp.matangazoDB, 17)
        } else if (cdata == 'tigo') {
            await delay(250)
            await bot.telegram.copyMessage(chatid, imp.matangazoDB, 18)
        } else if (cdata == 'airtel') {
            await delay(250)
            await bot.telegram.copyMessage(chatid, imp.matangazoDB, 19)
        } else if (cdata == 'halotel') {
            await delay(250)
            await bot.telegram.copyMessage(chatid, imp.matangazoDB, 20)
        } else if (cdata == 'safaricom') {
            await delay(250)
            await bot.telegram.copyMessage(chatid, imp.matangazoDB, 24)
        } else if (cdata == 'other_networks') {
            await delay(250)
            await bot.telegram.copyMessage(chatid, imp.matangazoDB, 23)
        }
        else if (cdata == 'help-msaada') {
            await delay(250)
            await bot.telegram.copyMessage(chatid, imp.matangazoDB, 12)
        }
    } catch (err) {
        console.log(err.message)
    }
})

bot.on('text', async ctx => {
    try {
        if (ctx.message.reply_to_message && admins.includes(ctx.chat.id)) {
            if (ctx.message.reply_to_message.text) {
                let my_msg = ctx.message.text
                let myid = ctx.chat.id
                let my_msg_id = ctx.message.message_id
                let umsg = ctx.message.reply_to_message.text
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let mid = Number(ids.split('&mid=')[1])

                await bot.telegram.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
            }

            else if (ctx.message.reply_to_message.photo) {
                let my_msg = ctx.message.text
                let umsg = ctx.message.reply_to_message.caption
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let mid = Number(ids.split('&mid=')[1])

                await bot.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
            }
        }


        else {
            //create user if not on database
            await call_function.createUser(ctx)

            let userid = ctx.chat.id
            let txt = ctx.message.text
            let username = ctx.chat.first_name
            let mid = ctx.message.message_id

            for (let m of miamala) {
                if (txt.toLowerCase().includes(m)) {
                    await bot.telegram.sendMessage(imp.shemdoe, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML' })
                }
            }

            switch (txt) {
                case '💰 Points Zangu':
                    let user = await rtStarterModel.findOne({ chatid: userid })
                    await ctx.reply(`Umebakiwa na Points ${user.points}.`)
                    break;

                case '➕ Ongeza Points':
                    await call_function.payingInfo(bot, ctx, delay, imp, userid, 26)
                    break;

                case '⛑ Help / Msaada ⛑':
                    await bot.telegram.copyMessage(userid, imp.matangazoDB, 25)
                    break;

                default:
                    await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
            }
        }

    } catch (err) {
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
        }
    }
})

bot.on('photo', async ctx => {
    try {
        let mid = ctx.message.message_id
        let username = ctx.chat.first_name
        let chatid = ctx.chat.id
        let cap = ctx.message.caption

        if (ctx.message.reply_to_message && admins.includes(ctx.chat.id)) {
            if (ctx.message.reply_to_message.text) {
                let umsg = ctx.message.reply_to_message.text
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let rmid = Number(ids.split('&mid=')[1])


                await bot.telegram.copyMessage(userid, chatid, mid, {
                    reply_to_message_id: rmid
                })
            }

            else if (ctx.message.reply_to_message.photo) {
                let umsg = ctx.message.reply_to_message.caption
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let rmid = Number(ids.split('&mid=')[1])


                await bot.telegram.copyMessage(userid, chatid, mid, {
                    reply_to_message_id: rmid
                })
            }
        }


        else {
            await bot.telegram.copyMessage(imp.halot, chatid, mid, {
                caption: cap + `\n\nfrom = <code>${username}</code>\nid = <code>${chatid}</code>&mid=${mid}`,
                parse_mode: 'HTML'
            })
            await bot.telegram.copyMessage(imp.shemdoe, chatid, mid, {
                caption: cap + `\n\nfrom = <code>${username}</code>\nid = <code>${chatid}</code>&mid=${mid}`,
                parse_mode: 'HTML'
            })
        }
    } catch (err) {
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
            console.log(err)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
            console.log(err)
        }
    }
})

bot.on('chat_join_request', async ctx => {
    let chatid = ctx.chatJoinRequest.from.id
    let username = ctx.chatJoinRequest.from.first_name
    let channel_id = ctx.chatJoinRequest.chat.id
    let cha_title = ctx.chatJoinRequest.chat.title
    let handle = 'unknown'

    const notOperate = [imp.xbongo, imp.rtgrp]

    try {
        //check @handle
        if (ctx.chatJoinRequest.from.username) {
            handle = ctx.chatJoinRequest.from.username
        }
        //dont process xbongo
        if (!notOperate.includes(channel_id)) {
            let user = await rtStarterModel.findOne({ chatid })
            if (!user) {
                await rtStarterModel.create({ chatid, username, handle, refferer: 'rtbot', free: 5, paid: false, startDate: null, endDate: null })
            }
            await bot.telegram.approveChatJoinRequest(channel_id, chatid)
            await bot.telegram.sendMessage(chatid, `Hongera! 🎉 Ombi lako la kujiunga na <b>${cha_title}</b> limekubaliwa.\n\nIngia sasa\nhttps://t.me/+8sYOwE1SqoFkOGY0\nhttps://t.me/+8sYOwE1SqoFkOGY0`, {
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        }

    } catch (err) {
        errMessage(err, chatid)
    }
})


bot.launch()
    .then(() => {
        console.log('Bot is running')
        bot.telegram.sendMessage(imp.shemdoe, 'Bot restarted')
            .catch((err) => console.log(err.message))
    })
    .catch((err) => {
        console.log('Bot is not running')
        bot.telegram.sendMessage(imp.shemdoe, err.message)
    })


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

process.on('unhandledRejection', (reason, promise) => {
    bot.telegram.sendMessage(imp.shemdoe, reason + ' It is an unhandled rejection.')
    console.log(reason)
    //on production here process will change from crash to start - cool
})

//caught any exception
process.on('uncaughtException', (err) => {
    console.log(err)
    bot.telegram.sendMessage(741815228, err.message + ' - It is uncaught exception.')
        .catch((err) => {
            console.log(err.message + ' while sending you')
        })
})
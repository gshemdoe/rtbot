const { Telegraf } = require('telegraf')
require('dotenv').config()
const mongoose = require('mongoose')
const rtStarterModel = require('./database/chats')
const malayaModel = require('./database/malaya')
const videosDB = require('./database/db')


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
    rtgrp: -1001899312985
}

//delaying
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function create(ctx) {
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
                chatid, username, handle, refferer
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

bot.start(async ctx => {
    try {
        //add to database if not
        await create(ctx)

        if (ctx.startPayload) {
            let pload = ctx.startPayload
            let userid = ctx.chat.id
            let url = `https://t.me/+8sYOwE1SqoFkOGY0`
            if(pload.includes('RTBOT-')) {
                let nano = pload.split('RTBOT-')[1]
                let vid = await videosDB.findOne({nano})

                await bot.telegram.copyMessage(userid, imp.ohmyDB, vid.msgId, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: "VIDEO ZAIDI - INGIA HAPA", url}
                            ]
                        ]
                    }
                })
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

bot.on('channel_post', async ctx=> {
    try {
        let chan_id = ctx.channelPost.chat.id
        if(chan_id == imp.malayaDB && ctx.channelPost.reply_to_message) {
            let msg = ctx.channelPost.text
            let msg_id = ctx.channelPost.message_id
            let rpid = ctx.channelPost.reply_to_message.message_id
            if(msg.toLowerCase().includes('add malaya')) {
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
                                {text: 'Publish This', callback_data: `push_bitch_${malaya_id}`}
                            ],
                            [
                                {text: 'Ignore', callback_data: `ignore_push`}
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

bot.on('callback_query', async ctx=> {
    try {
        let cdata = ctx.callbackQuery.data
        let cmsgid = ctx.callbackQuery.message.message_id
        
        if(cdata.includes('push_bitch_')) {
            //
        } else if(cdata.includes('ignore_push')) {
            //
        }
    } catch (err) {
        console.log(err.message)
    }
})

bot.on('text', async ctx => {
    try {
        if (ctx.message.reply_to_message && ctx.chat.id == imp.halot) {
            if (ctx.message.reply_to_message.text) {
                let my_msg = ctx.message.text
                let myid = ctx.chat.id
                let my_msg_id = ctx.message.message_id
                let umsg = ctx.message.reply_to_message.text
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let mid = Number(ids.split('&mid=')[1])

                if (my_msg == 'block 666') {
                    await rtStarterModel.findOneAndUpdate({ chatid: userid }, { blocked: true })
                    await ctx.reply(userid + ' blocked for mass massaging')
                }

                else if (my_msg == 'unblock 666') {
                    await rtStarterModel.findOneAndUpdate({ chatid: userid }, { blocked: false })
                    await ctx.reply(userid + ' unblocked for mass massaging')
                }

                else {
                    await bot.telegram.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
                }

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
            await create(ctx)

            let userid = ctx.chat.id
            let txt = ctx.message.text
            let username = ctx.chat.first_name
            let mid = ctx.message.message_id

            await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
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

        if (ctx.message.reply_to_message && chatid == imp.halot) {
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

    const notOperate = [imp.xbongo, imp.rtgrp]

    try {
        //dont process xbongo
        if (!notOperate.includes(channel_id)) {
            let user = await rtStarterModel.findOne({chatid})
            if (!user) {
                await rtStarterModel.create({ chatid, username, refferer: 'rtbot' })
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
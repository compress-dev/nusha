const config = require('./config.js')
const express = require('express')
const models = require('./models')
const is_url = require('is-url')
const activate = require('./activate.js')
const app = express()
const telegram = require('./libs/telegram.js')
const messages = require('./messages.js')
telegram.set_token(config.token)
telegram.start()

telegram.on_text('/start', (args, name, username, chat_id, message) => {
  models.Member.findOne({_id: chat_id}, (err, member) => {
    if(member){
      console.log('user is logged in')
    }else{
      member = models.Member({ _id: chat_id, name, username })
      member.save()
      
      telegram.send_text_message(chat_id,`
      hi ${name}
      do you wanna to conitnue the registering method?
      okay! just grant me access to your account status, I have to get your tracks
      `,{
        "reply_markup":{
          "inline_keyboard": [[{
            "text": "start registration",
            "callback_data": `_register_start`
          }]]}
      }, () => {})  
    }
  })
})

telegram.on_any_text((text, name, username, chat_id, message) => {
  models.Member.findOne({_id: chat_id}, (err, member) => {
    if(member){
      if(is_url(text) && text.startsWith('https://wakatime.com')){
        switch (member.status) {
          case 4:
            /* sent the code activity url */
            activate.code_activity_url(text, () => {
              member.links.code_activity = text
              member.status = 5
              member.save()
              messages.language(chat_id, telegram)
            }, () => {
              messages.valid_url(chat_id, telegram)
            })
            break;
          case 5:
            /* sent the languages url */
            activate.language_url(text, () => {
              member.links.languages = text
              member.status = 6
              member.save()
              messages.editors(chat_id, telegram)
            }, () => {
              messages.valid_url(chat_id, telegram)
            })
          break;
        case 6:
          /* sent the editors url */
          activate.editor_url(text, () => {
            member.links.editors = text
            member.status = 7
            member.save()
            messages.os(chat_id, telegram)
          }, () => {
            messages.valid_url(chat_id, telegram)
          })
          break;
        case 7:
          /* sent the operation systems url */
          activate.os_url(text, () => {
            member.links.os = text
            member.status = 1
            member.save()
            messages.register_done(chat_id, telegram)
          }, () => {
            messages.valid_url(chat_id, telegram)
          })
          break;
        default:
          break;
        }
      }else{
        messages.valid_url(chat_id, telegram)
      }
    }else{
      console.log(`member not found ${chat_id}`)
    }
  })
})

telegram.on_any_callback((data, name, username, chat_id, message) => {
  switch (data) {
    case '_register_start':
      start_registering(chat_id)
      break;
    case '_register_ca':
      register_code_activity(chat_id)
      break;
    default:
      break;
  }
})

/**
 * user started to register in this step
 * we have to send a message to ensure user whom is registered in wakatime.com
 * user have to login to account
 * @param {*} chat_id 
 */
var start_registering = (chat_id) => {
  models.Member.findOne({_id: chat_id, status: 1}, (err, member) => {
    if(member){
      member.status = 3
      member.save()
      messages.register(chat_id, telegram)
    }else{
      console.log('member not found!')
    }
  })
}
/**
 * now we know user is registered in wakatime.com
 * user have to generate the links of wakatime
 * first link is the code activity link
 * @param {*} chat_id 
 */
var register_code_activity = (chat_id) => {
  models.Member.findOne({_id: chat_id, status: 3}, (err, member) => {
    if(member){
      member.status = 4
      member.save()
      messages.code_activity(chat_id, telegram)
    }else{

    }
  })
}

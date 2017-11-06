var request = require("request");

var token = 'NA'
var text_messages_splitter = ' '

var set_token = (bot_token) => {
  token = bot_token
}

var set_text_messages_splitter = (splitter) => {
  text_messages_splitter = splitter
}

var get_me = (success, fail) => {
  send_request('getMe', {}, (response) => {
    if(response.ok)
      success(response.result)
    else{
      console.log(response)
      fail()
    }
  })
}

var get_updates = (offset, success, fail) => {
  send_request('getUpdates', {offset}, (response) => {
    if(response.ok){
      if(response.result.length>0)
        success(response.result)
    }else
      fail()
  })
}
/* send a single request to telegram apis and returns the answer */
var send_request = (method, body, on_success) => {
  var options = { 
    method: 'GET',
    url: `https://api.telegram.org/bot${token}/${method}`,
    headers: { 'content-type': 'application/json' },
    body,
    json: true 
  }
  request(options, function (error, response, body) {
    if(error){
      console.log(`sending method ${method} failed(token ${token})`)
    }else{
      on_success(body)
    }
  })
}

var start = () => {
  get_me(
    // success
    (info) => {
      console.log(`connected to bot ${info.username}`)
    }, () => {
      console.log('can not connect to bot. check your internet connectivity or token')
    }
  )
  
  var last_update_id = 0
  var check_updates = () => {
    get_updates(last_update_id,
      (messages) => {
        messages.forEach((message) => {
          if(last_update_id <= message.update_id){
            last_update_id = message.update_id+1
          }
          if('text' in message.message)
            got_text_message(message.message.text, message.message.chat.first_name, message.message.chat.username, message)
        })
      }, () => {
        console.log('error in checking for updates')
      }
    )
  }
  setInterval(check_updates, 2000)
}

/*
    text message callbacks
*/
var text_message_hooks = {}

var got_text_message = (text, name, username, message) => {
  var parts = text.split(text_messages_splitter)
  var command = parts[0]
  if(command in text_message_hooks){
    parts.splice(0,1)
    text_message_hooks[command].callback(parts, name, username, message)
  }
  else
  console.log(`${message.update_id}#${username}: ${text}`)
}

var on_text = (command_string, callback, spliter=' ') =>{
  text_message_hooks[command_string] = {callback, spliter}
}
module.exports = {
  set_token,
  text_messages_splitter,
  token,
  
  start,

  on_text,
  get_me,
  get_updates,
}
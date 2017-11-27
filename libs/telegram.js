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
          if('message' in message)
            got_text_message(message)
          else if('callback_query' in message)
            got_callback_message(message)
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
var callback_message_hooks = {}

var any_text_message_hook_method = null
var any_callback_hook_method = null

var got_text_message = (message) => {
  var parts = message.message.text.split(text_messages_splitter)
  var command = parts[0]
  if(command in text_message_hooks){
    parts.splice(0,1)
    text_message_hooks[command].callback(parts, message.message.chat.first_name || 'NA', message.message.chat.username || 'NA', message.message.chat.id, message)
  }else{
    if(any_text_message_hook_method)
      any_text_message_hook_method(
        message.message.text,
        message.message.chat.first_name || 'NA',
        message.message.chat.username || 'NA',
        message.message.chat.id, 
        message
      )
  }
}

var got_callback_message = (message) => {
  var parts = message.callback_query.data.split(text_messages_splitter)
  var command = parts[0]
  if(command in callback_message_hooks){
    parts.splice(0,1)
    callback_message_hooks[command].callback(parts, message.callback_query.message.chat.first_name || 'NA', message.callback_query.message.chat.username || 'NA', message.callback_query.message.chat.id, message)
  }else{
    if(any_callback_hook_method)
      any_callback_hook_method(
        message.callback_query.data,
        message.callback_query.message.chat.first_name || 'NA',
        message.callback_query.message.chat.username || 'NA', 
        message.callback_query.message.chat.id, 
        message
      )
  }
}
var send_text_message = (chat_id, text, options, callback) => {
  send_request('sendMessage', Object.assign({chat_id, text}, options),
    (response) => {
      if(response.ok)
        return callback(response.result)
      else
        console.log(`message to ${chat_id} to failed`)
    }
  )
}

var on_text = (command_string, callback) => {
  text_message_hooks[command_string] = {callback}
}
var on_any_text = (callback) => {
  any_text_message_hook_method = callback
}

var on_callback = (command_string, callback) => {
  callback_message_hooks[command_string] = {callback}
}
var on_any_callback = (callback) => {
  any_callback_hook_method = callback
}

module.exports = {
  set_token,
  text_messages_splitter,
  token,
  
  start,

  on_text,
  on_any_text,
  on_any_callback,

  get_me,
  get_updates,
  send_text_message,
}
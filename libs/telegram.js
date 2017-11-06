var request = require("request");

var token = 'NA'

var set_token = (bot_token) => {
  token = bot_token
}

var get_me = (success, fail) => {
  send_request('getMe', {}, (response) => {
    if(response.ok)
      success(response.result)
    else
      fail()
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

module.exports = {
  set_token,

  get_me,
  get_updates,
}
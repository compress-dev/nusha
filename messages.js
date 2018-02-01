/**
* on success and on fail callback defaults are here
*/
var on_sucess_default = () => {
  console.log('message success')
}
var on_fail_default = () => {
  console.log('message success')
}

var dictionary = {
  registering_method: `
  so...
  make sure you are registered in wakatime, heres the link:
  https://wakatime.com
  login to your wakatime account
  `,
  code_activity: `
  well
  now from side bar, go to SVG Charts, and generate json link for your code activity
  then send the link to me
  exactly the link! I have to validate the link
  `,
  language: `
  now generate the languages link and enter it here
  `,
  valid_url: `
  please enter the valid url
  `,
  editors: `
  now generate the editors link and enter it here
  `,
  os: `
  now generate the operating systems link and enter it here
  `,
  register_done: `
  it's ok! now you can check your ranking for next report in @lash_coders
  `
}

var register = (chat_id, telegram, on_sucess = on_sucess_default, on_fail = on_fail_default) => {
  telegram.send_text_message(chat_id, dictionary.registering_method,{
    "reply_markup":{
      "inline_keyboard": [[{
        "text": "i'm in, next step?",
        "callback_data": `_register_ca`
      }]]}
  })
}

var code_activity = (chat_id, telegram, on_sucess = on_sucess_default, on_fail = on_fail_default) => {
  telegram.send_text_message(chat_id, dictionary.code_activity,{})
}

var language = (chat_id, telegram, on_sucess = on_sucess_default, on_fail = on_fail_default) => {
  telegram.send_text_message(chat_id, dictionary.language,{})
}

var valid_url = (chat_id, telegram, on_sucess = on_sucess_default, on_fail = on_fail_default) => {
  telegram.send_text_message(chat_id, dictionary.valid_url,{})
}

var editors = (chat_id, telegram, on_sucess = on_sucess_default, on_fail = on_fail_default) => {
  telegram.send_text_message(chat_id, dictionary.editors,{})
}

var os = (chat_id, telegram, on_sucess = on_sucess_default, on_fail = on_fail_default) => {
  telegram.send_text_message(chat_id, dictionary.os,{})
}

var register_done = (chat_id, telegram, on_sucess = on_sucess_default, on_fail = on_fail_default) => {
  telegram.send_text_message(chat_id, dictionary.register_done,{})
}

module.exports = {
  register,
  code_activity,
  language,
  valid_url,
  editors,
  os,
  register_done,
}
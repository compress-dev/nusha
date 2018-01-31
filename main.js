const config = require('./config.js');

const telegram = require('./libs/telegram.js')
telegram.set_token(config.token)
telegram.start()

telegram.on_text('/start', (args, name, username, chat_id, message) => {
  telegram.send_text_message(chat_id, `
hi ${name}
do you wanna to conitnue the registering method?
okay! just grant me access to your account status, I have to get your tracks
  `,{
    "reply_markup":{
		  "inline_keyboard": [[{
        "text": "Login to WakaTime",
        "url": `https://wakatime.com/oauth/authorize?response_type=${config.response_type}&client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&scope=${config.scope}`
      }]]}
	}, () => {
    console.log(`new member ${username}(${chat_id}) started`)
  })
})

telegram.on_text('/repeat', (args, name, username, chat_id, message) => {
  console.log(`repeat#${username}(${chat_id}): ${args}`)
  telegram.send_text_message(chat_id, args.join(telegram.text_messages_splitter), {}, () => {

  })
})

telegram.on_any_text((text, name, username, chat_id, message) => {
  telegram.send_text_message(chat_id, `any text ${text}`, {}, () => {
    console.log('sent: ' + text)
  })
})

telegram.on_any_callback((data, name, username, chat_id, message) => {
  telegram.send_text_message(chat_id, data, {}, () => {
    
  })
})
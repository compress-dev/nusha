const token = '460908339:AAGMTxi85BuwbHjZejRm7CyVoXFDRTocRtk'


const telegram = require('./libs/telegram.js')
telegram.set_token(token)
telegram.start()

telegram.on_text('/echo', (args, name, username, message) => {
  console.log(`echo: ${args}`)
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
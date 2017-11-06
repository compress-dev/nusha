const token = '460908339:AAGMTxi85BuwbHjZejRm7CyVoXFDRTocRtk'


const telegram = require('./libs/telegram.js')
telegram.set_token(token)
telegram.start()

telegram.on_text('/echo', (args, name, username, message) => {
  console.log(`echo: ${args}`)
})

telegram.on_text('/repeat', (args, name, username, message) => {
  console.log(`repeat#${name}: ${args}`)
})
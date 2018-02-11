const config = require('./config.js')
const models = require('./models')


var get_code_activity = (member, on_success) => {
  var request = require("request");
  
  var jar = request.jar();  
  var options = { method: 'GET',
    url: member.links.code_activity,
    jar: 'JAR' };
  
  request(options, function (error, response, body) {
    if(!error)
      on_success(JSON.parse(body).data)
  });
  
}

var time_string = (seconds) => {
  var m = Math.floor(seconds / 60)
  var h = Math.floor(m / 60)
  m %= 60
  return `${h} hrs and ${m} minuates`
}
/* process the single member score */
var single_member = (member, length, on_hook) => {
  get_code_activity(member, (body) => {
    var total = 0
    for(var i=0; i<body.length; i++){
      total += body[i].grand_total.total_seconds
    }
    ranks.push({_id: member._id, name: member.name, score: total})
    on_hook()
  })
}

/* main script */
var ranks = [];

models.Member.find({status: 1}, (err, members) => {
  for(var i=0; i<members.length; i++){
    single_member(members[i], members.length, () => {
      if(ranks.length == members.length){
        list_completed()
      }
    })
  }
})

var list_completed = () => {
  ranks = ranks.sort((a, b) => {
    return b.score - a.score
  })
  var date = new Date();
  // now ranks is a sorted list of members by it's code activity score
  var message = `
Todays Ranking! (${date.getFullYear()}/${date.getMonth()}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()})
---------------------------
`
  for(var i=1; i< Math.min(3, ranks.length); i++){
    message += `${i}. <b>${ranks[i].name}</b> by <i>${time_string(ranks[i].score)}</i>
`
  }
  for(var i=3; i< ranks.length; i++){
    message += `${i}. <b>${ranks[i].name}</b> by <i>${time_string(ranks[i].score)}</i>
`
  }
  send_message_to_channel(message, () => {
    console.log(`rankings sent`)
    knok_the_champion(ranks[0])
  })
}

var knok_the_champion = (rank) => {
  get_last_profile_photo(rank._id, (photo) => {
    var message = `
    aaaaaannnnd our champion is ${rank.name} by ${time_string(rank.score)}
    `
    send_photo_to_channel(photo, message, () => {})
  }, () => {
    var message = `
    aaaaaannnnd our champion is ${rank.name} by <i>${time_string(rank.score)}</i>
    `
    send_message_to_channel(message, () => {})
  })
}

var send_message_to_channel = (text, on_success) => {
  var request = require("request");
  
  var options = { method: 'GET',
    url: 'https://api.telegram.org/bot544677252:AAEE6ZDRz2BeaGz6ik2LLYz4Nh20bjrXUcU/sendMessage',
    headers: { 'content-type': 'application/json' },
    body: 
     { chat_id: '@lash_coders',
       text,
       parse_mode: 'HTML' },
    json: true };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    on_success()
  });  
}

var send_photo_to_channel = (photo, caption, on_success) => {
  var request = require("request");  
  var options = { method: 'GET',
    url: 'https://api.telegram.org/bot544677252:AAEE6ZDRz2BeaGz6ik2LLYz4Nh20bjrXUcU/sendPhoto',
    headers: { 'content-type': 'application/json' },
    body: 
     { chat_id: '@lash_coders',
       photo, caption },
    json: true };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    on_success()
  });
}

var get_last_profile_photo = (user_id, on_success, no_image) => {
  var request = require("request");
  var options = { method: 'GET',
    url: 'https://api.telegram.org/bot544677252:AAEE6ZDRz2BeaGz6ik2LLYz4Nh20bjrXUcU/getUserProfilePhotos',
    headers: { 'content-type': 'application/json' },
    body: { user_id, offset: '0', limit: '1' },
    json: true };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if(body.ok){
      if(body.result.total_count > 0){
        on_success(body.result.photos[0][1].file_id)
      }else
        no_image()
    }
  });
  
}
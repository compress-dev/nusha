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
  // now ranks is a sorted list of members by it's code activity score
  var message = `
Todays Ranking! (${Date()})
---------------------------
`
  for(var i=0; i< Math.min(3, ranks.length); i++){
    message += `${i}. **${ranks[i].name}** by __${time_string(ranks[i].score)}__
`
  }
  for(var i=3; i< ranks.length; i++){
    message += `${i}. ${ranks[i].name} by __${time_string(ranks[i].score)}__
`
  }
  console.log(message)
}
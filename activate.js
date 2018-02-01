const url_schema = require('./json-schemas.js')
const request = require("request")
const is_json = require('is-json')

// https://wakatime.com/share/@mrException/645c9021-13ae-42ba-840f-dfc1b38cb132.json
var code_activity_url = (url, on_success, on_fail) => {
  var jar = request.jar()
  var options = { method: 'GET',
    url,
    jar: 'JAR' }
  request(options, function (error, response, body) {
    if(error || !is_json(body))
      on_fail()
    else{
      var result = JSON.parse(body)
      if(url_schema.check_code_activity(result))
        on_success()
      else
        on_fail()
    }
  });
}

// https://wakatime.com/share/@mrException/82c3d824-c13d-4998-9fe8-c819466be05e.json
var language_url = (url, on_success, on_fail) => {
  var jar = request.jar()
  var options = { method: 'GET',
    url,
    jar: 'JAR' }
  request(options, function (error, response, body) {
    if(error || !is_json(body))
      on_fail()
    else{
      var result = JSON.parse(body)
      if(url_schema.check_language(result))
        on_success()
      else
        on_fail()
    }
  });
}

// https://wakatime.com/share/@mrException/541f62e9-eb5b-461e-a45f-82b50648c580.json
var editor_url = (url, on_success, on_fail) => {
  var jar = request.jar()
  var options = { method: 'GET',
    url,
    jar: 'JAR' }
  request(options, function (error, response, body) {
    if(error || !is_json(body))
      on_fail()
    else{
      var result = JSON.parse(body)
      if(url_schema.check_editor(result))
        on_success()
      else
        on_fail()
    }
  });
}

// https://wakatime.com/share/@mrException/442ccd73-a09d-4238-9aeb-2855bf337cd0.json
var os_url = (url, on_success, on_fail) => {
  var jar = request.jar()
  var options = { method: 'GET',
    url,
    jar: 'JAR' }
  request(options, function (error, response, body) {
    if(error || !is_json(body))
      on_fail()
    else{
      var result = JSON.parse(body)
      if(url_schema.check_os(result))
        on_success()
      else
        on_fail()
    }
  });
}

module.exports = {
  os_url,
  code_activity_url,
  language_url,
  editor_url,
}
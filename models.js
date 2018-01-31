const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wakatime');

const Member = mongoose.model('Member', 
  {
    _id: String,
    name:   { type: String, require: true, default: 'NA'},
    username:     { type: String, require: true, default: 'NA'},
    links: {
      code_activity:  { type: String, require: true, default: 'NA'},
      languages:      { type: String, require: true, default: 'NA'},
      editors:        { type: String, require: true, default: 'NA'},
      os:             { type: String, require: true, default: 'NA'},
    },
    status: {
      type: Number,
      default: 0,
      enum: [
        1, // started, free
        2, // block
        3, // registering - register in wakatime
        4, // registering - generate code activity link
        5, // registering - generate languages link
        6, // registering - generate editors link
        7, // registering - generate os link
        8,
      ]
    }
  }
);

module.exports = {
  Member
}
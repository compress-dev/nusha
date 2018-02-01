var Validator = require('jsonschema').Validator;
var v = new Validator();

var code_activity_schema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          grand_total: {type: "object"},
          range: {type: "object"}
        },
        required: ['grand_total', 'range']
      }
    }
  }
};

var language_schema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {type: "string"},
          percent: {type: "float"}
        },
        required: ['name', 'percent']
      }
    }
  }
};

var editors_schema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {type: "string"},
          percent: {type: "float"}
        },
        required: ['name', 'percent']
      }
    }
  }
};

var os_schema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {type: "string"},
          percent: {type: "float"}
        },
        required: ['name', 'percent']
      }
    }
  }
};
var check_code_activity = (input) => {
  return v.validate(input, code_activity_schema).errors.length == 0
}

var check_language = (input) => {
  console.log(input)
  return v.validate(input, language_schema).errors.length == 0
}

var check_editor = (input) => {
  return v.validate(input, editors_schema).errors.length == 0
}

var check_os = (input) => {
  return v.validate(input, os_schema).errors.length == 0
}


module.exports = {
  check_code_activity,
  check_language,
  check_editor,
  check_os,
}
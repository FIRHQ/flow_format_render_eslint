var jade = require('jade');

module.exports = {

  render: function (template, locals) {
    return jade.renderFile(template, locals);
  }

};

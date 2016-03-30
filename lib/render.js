var fs = require('fs');
var path = require('path');

var JadeRender = require('./jade_render');

module.exports = function (options) {

  var eslintResultJson = [];

  if (options.eslintResult) {
    eslintResultJson = options.eslintResult;
  } else if (options.eslintResultFile) {
    var result = fs.readFileSync(options.eslintResultFile);
    result = JSON.parse(String(result));
  }

  var html = JadeRender.render(options.template, {
    files: result,
    filesCount: result.length
  });

  var distDir = path.join(__dirname, '../dist');
  var distFile = distDir + '/index.html';

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  fs.writeFileSync(distFile, html);
};

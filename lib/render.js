var fs = require('fs');
var path = require('path');

var JadeRender = require('./jade_render');

function Format(date, fmt) { //author: meizz
  var o = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

module.exports = function (options) {

  var eslintResultJson = [];

  if (options.eslintResult) {
    eslintResultJson = options.eslintResult;
  } else if (options.eslintResultFile) {
    var result = fs.readFileSync(options.eslintResultFile);
    result = JSON.parse(String(result));
  }

  var errorCount = 0
  var warningCount = 0;

  result.map(file => {
    file.messages.map(msg => {
      msg.severity_str = msg.severity === 1 ? 'warning' : 'error';
    });

    errorCount += file.errorCount;
    warningCount += file.warningCount;
  });

  const locals = {
    files: result,
    filesCount: result.length,
    errorCount,
    warningCount,
    project: options.project,
    event: options.event,
    job: options.job,
    nowTime: Format(new Date(), 'yyyy-MM-dd')
  };

  var html = JadeRender.render(options.template, locals);

  var distDir = path.join(__dirname, '../dist');
  var distFile = distDir + '/index.html';

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  fs.writeFileSync(distFile, html);
};

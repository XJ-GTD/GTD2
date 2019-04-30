function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);
  
  if (input.data && input.data[0] !== undefined) {
    var hasNoServiceNlp = false;
    var hasServiceNlp = false;
    
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent'] && !data['intent']['service']) {
        hasNoServiceNlp = true;
      } else if (data['sub'] === 'nlp' && data['intent'] && data['intent']['service']) {
        hasServiceNlp = true;
      }
    }
  }
  
  // filter source code here end
  return (hasNoServiceNlp && !hasServiceNlp);
}

function clean(datasource) 
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);
  var data = input.data[0];
  for (var di in input.data) {
    var dt = input.data[di];
    if (dt['sub'] === 'nlp' && dt['intent']) {
      data = dt;
    }
  }
  
  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + date.getMonth()+1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  
  // 取得迅飞语音消息内容
  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var clientcontext = input['_context']['client'];
  var servercontext = input['_context']['server'];
  var text = (data && data['intent'] && data['intent']['text'])? data['intent']['text'] : '';

  // 返回消息头部
  // 确认前
  output.header = {
    version: 'V1.0',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['S']
  };
  
  output.original = text;
  
  output.content = {};
  
  output.content['S'] = {
    option: 'S.P',
    parameters: {
      t: 'UNKNOWN'
    }
  };
  
  output.context = {};
  
  if (clientcontext && clientcontext !== undefined) {
  	output.context['client'] = clientcontext;
  }
  
  var standardnext = {};
  
  standardnext.announceTo = [userId + ';' + deviceId];
  standardnext.announceType = 'inteligence_mix';
  standardnext.announceContent = {mwxing:output};
  
  print(JSON.stringify(standardnext));
  
  // filter source code here end
  return JSON.stringify(standardnext);
}
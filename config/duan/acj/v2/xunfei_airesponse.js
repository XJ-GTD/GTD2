function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

 if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

 if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service']) {
        var service = data['intent']['service'];
        if (service && (service === 'Turing' || service === 'constellation' || service === 'flight' || service === 'joke' || service === 'news' || service === 'story' || service === 'train' || service === 'weather' || service === 'forex' || service === 'KLLI3.areaScaler' || service === 'KLLI3.volumeScaler' || service === 'KLLI3.numberScaler' || service === 'KLLI3.powerScaler' || service === 'KLLI3.weightScaler' || service === 'LEIQIAO.timesTable' || service === 'AIUI.calc' || service === 'datetimeX')) {
          return true;
        }
      }
    }
  }

  // filter source code here end
  return false;
}

function clean(datasource)
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);
  var data = {};

  for (var di in input.data) {
    var dt = input.data[di];
    if (dt['sub'] === 'nlp' && dt['intent']['service']) {
      var service = dt['intent']['service'];
      if (service && (service === 'Turing' || service === 'constellation' || service === 'flight' || service === 'joke' || service === 'news' || service === 'story' || service === 'train' || service === 'weather' || service === 'forex' || service === 'KLLI3.areaScaler' || service === 'KLLI3.volumeScaler' || service === 'KLLI3.numberScaler' || service === 'KLLI3.powerScaler' || service === 'KLLI3.weightScaler' || service === 'LEIQIAO.timesTable' || service === 'AIUI.calc' || service === 'datetimeX')) {
        data = dt;
      }
    }
  }

  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  // 取得迅飞语音消息内容
  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var clientcontext = input['_context']['client'];
  var servercontext = input['_context']['server'];
  var text = data['intent']['text'];
  var answer = '';

  if (data['intent'] && data['intent']['answer'] && data['intent']['answer']['text']) {
    answer = data['intent']['answer']['text'];
  }

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['S']
  };

  output.original = text;
  output.content = {};

  // 智能回答
  if (answer && answer !== '') {
    output.content['0'] = {
      processor: 'S',
      option: 'S.AN',
      parameters: {
        an: answer,
        listen: true
      }
    };
  } else {
    output.content['0'] = {
      processor: 'S',
      option: 'S.P',
      parameters: {
        t: 'UNKONWN'
      }
    };
  }

  output.context = {};

  if (clientcontext && clientcontext !== undefined) {
  	output.context['client'] = clientcontext;
  }

  var standardnext = {};

  standardnext.announceTo = [userId + ';' + deviceId];
  standardnext.announceType = 'inteligence_mix';
  standardnext.announceContent = {mwxing:output};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

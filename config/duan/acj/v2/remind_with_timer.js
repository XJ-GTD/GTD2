function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.SomethingAlert' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
          var semantics = data['intent']['semantic'];

          for (var sei in semantics) {
            var semantic = semantics[sei];

            if (semantic['intent'] === 'Timer') {
              return true;
            }
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
  var data = input.data[0];
  for (var di in input.data) {
    var dt = input.data[di];
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.SomethingAlert' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
      data = dt;
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
  var contacts = new Array();
  var date = '';
  var time = '';
  var title = '';
  var seconds = 0;
  var minutes = 0;
  var hours = 0;

  var semantics = data['intent']['semantic'];

  for (var sei in semantics) {
    var semantic = semantics[sei];

    var slots = semantic['slots'];

    for (var si in slots) {
      var slot = slots[si];

      // 取出涉及按秒计时
      if (slot['name'] === 'seconds') {
        seconds = slot['normValue'];
      }

      // 取出涉及按分钟计时
      if (slot['name'] === 'minutes') {
        minutes = slot['normValue'];
      }

      // 取出涉及按小时计时
      if (slot['name'] === 'hours') {
        hours = slot['normValue'];
      }

      // 取出涉及时间结果
      if (slot['name'] === 'whentodo') {
        var value = slot['normValue'];

        if (value && value !== undefined && value !== '') {
          var normValue = JSON.parse(value);
          var suggestDatetime = normValue['suggestDatetime'];

          print('suggestDatetime: ' + suggestDatetime);
          // 包含时间
          var reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
          var r = suggestDatetime.match(reg);

          if (r) {
            date = r[1] + '/' + r[2] + '/' + r[3];
            //time = r[4] + ':' + r[5] + ':' + r[6];
            time = r[4] + ':' + r[5];
          }

          // 没有时间
          var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
          var rd = suggestDatetime.match(regd);

          if (rd) {
            date = rd[1] + '/' + rd[2] + '/' + rd[3];
            time = '08:00'; // 默认设置全天
          }
        }
      }

    }
  }

  var output = {};

  // 返回消息头部
  // 确认前
  output.header = {
    version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['R', 'S']
  };

  output.original = text;

  output.content = {};

  // 确认前
  // 查询联系人指示
  output.content['0'] = {
    processor: 'R',
    option: 'R.T',
    parameters: {
      h: hours,
      m: minutes,
      s: seconds
    }
  };

  output.content['1'] = {
    processor: 'S',
    option: 'S.P',
    parameters: {
      t: 'TM'
    },
    input: {
      textvariables: []
    }
  };

  if (hours) {
    output.content['1']['input']['textvariables'].push({name: 'hours', value: hours + '小时'});
  } else {
    output.content['1']['input']['textvariables'].push({name: 'hours', value: ''});
  }

  if (minutes) {
    output.content['1']['input']['textvariables'].push({name: 'minutes', value: minutes + '分钟'});
  } else {
    output.content['1']['input']['textvariables'].push({name: 'minutes', value: ''});
  }

  if (seconds) {
    output.content['1']['input']['textvariables'].push({name: 'seconds', value: seconds + '秒'});
  } else {
    output.content['1']['input']['textvariables'].push({name: 'seconds', value: ''});
  }

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

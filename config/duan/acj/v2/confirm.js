// Version 1.1
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.CreateGuide' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
        var moreResults = data['intent']['moreResults'];

        // 排除 确认和取消指令
        for (var more in moreResults) {
          var moreresult = moreResults[more];

          if (moreresult['category'] == 'OS6981162467.Confirm') {
            return true;
          }
        }
      }

      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.Confirm' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
        var semantics = data['intent']['semantic'];

        for (var sei in semantics) {
          var semantic = semantics[sei];

          if (semantic['intent'] === 'OK' || semantic['intent'] === 'Cancel') {
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
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.CreateGuide' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
      var moreResults = dt['intent']['moreResults'];

      // 排除 确认和取消指令
      for (var more in moreResults) {
        var moreresult = moreResults[more];

        if (moreresult['category'] == 'OS6981162467.Confirm') {
          data = dt;
          data['intent'] = moreresult;
        }
      }
    }

    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.Confirm' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
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
  var shouldEndSession = data['intent']['shouldEndSession'];
  var answer = data['intent']['answer']? data['intent']['answer']['text'] : '';
  var text = data['intent']['text'];
  var contacts = new Array();
  var date = '';
  var time = '';
  var title = '';
  var confirm = '';

  var semantics = data['intent']['semantic'];

  for (var sei in semantics) {
    var semantic = semantics[sei];

    confirm = semantic['intent'];
  }

  var output = {};

  // 返回消息头部
  // 确认后
  output.header = {
    version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['SC', 'O', 'S']
  };

  output.original = text;

  output.content = {};

  // 确认后
  // 读取上下文指示
  output.content['0'] = {
    processor: 'SC',
    option: 'SC.T',
    parameters: {},
    output: {
      prvoption: "prvoption"
    }
  };

  if (confirm === 'OK') {
    // 确认
    output.content['1'] = {
      processor: 'O',
      option: 'O.O',
      parameters: {}
    };

    output.header['describe'].splice(2, 0, "SS"); // 插入缓存描述
    output.content['2'] = {
      processor: 'SS',
      option: 'SS.F',
      parameters: {}
    };

    output.content['3'] = {
      processor: 'S',
      option: 'S.P',
      parameters: {
        t: 'AA'
      },
      input: {
        type: "function(agds, showagds, prvopt, user, memos, planitems) { if (agds && agds.length <= 0 && memos && memos.length <= 0 && planitems && planitems.length <= 0) return 'NONE'; else return prvopt; }",
        showagendas: ""
      }
    };
  }

  if (confirm === 'Cancel') {
    // 取消
    output.content['1'] = {
      processor: 'O',
      option: 'O.C',
      parameters: {}
    };

    output.content['2'] = {
      option: 'S.P',
      parameters: {
        t: 'BB'
      },
      input: {
        type: "function(agds, showagds, prvopt, user, memos, planitems) { if (agds && agds.length <= 0 && memos && memos.length <= 0 && planitems && planitems.length <= 0) return 'NONE'; else return prvopt; }",
        showagendas: ""
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

  print(JSON.stringify(standardnext));

  // filter source code here end
  return JSON.stringify(standardnext);
}

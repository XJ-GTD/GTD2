// CREATE_MEMO_WITH_GUIDE_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.CreateGuide' && data['intent']['intentType'] === 'custom' && data['intent']['shouldEndSession']) {
        // 存在意图确认, 意图确认结果返回
        return true;
      } else if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.CreateGuide' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
        var moreResults = data['intent']['moreResults'];

        // 排除 确认和取消指令
        for (var more in moreResults) {
          var moreresult = moreResults[more];

          if (moreresult['category'] == 'OS6981162467.Confirm') {
            return false;
          }
        }

        var semantics = data['intent']['semantic'];

        for (var sei in semantics) {
          var semantic = semantics[sei];

          if (semantic['intent'] === 'MemoGuide' || (input['_context'] && input['_context']['server'] && input['_context']['server']['memo'] && (semantic['intent'] === 'InputDatetime' || semantic['intent'] === 'InputSomething' || semantic['intent'] === 'InputAddress' || semantic['intent'] === 'InputMember' || semantic['intent'] === 'EndGuide'))) {
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
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.CreateGuide' && dt['intent']['intentType'] === 'custom' && dt['intent']['shouldEndSession']) {
      data = dt;
    } else if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.CreateGuide' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
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
  var servercontext = input['_context']['server'] || {};
  var shouldEndSession = data['intent']['shouldEndSession'];
  var answer = data['intent']['answer']? data['intent']['answer']['text'] : '';
  var text = data['intent']['text'];
  var contacts = new Array();
  var date = '';
  var time = '';
  var title = '';
  var address = '';

  var semantics = data['intent']['semantic'];
  var intent = 'MemoGuide';

  for (var sei in semantics) {
    var semantic = semantics[sei];

    intent = semantic['intent'];
    var slots = semantic['slots'];

    for (var si in slots) {
      var slot = slots[si];

      // 取出关联联系人结果
      if (slot['name'] === 'whotodo') {
        contacts.push({n:slot['normValue']});
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
            time = '99:99'; // 默认设置全天
          }
        }
      }

      // 取出涉及日程标题
      if (slot['name'] === 'whattodo') {
        title = slot['normValue'];
      }

      // 取出活动地址
      if (slot['name'] === 'wheretodo') {
        address = slot['normValue'];
      }
    }
  }

  var output = {};

  output.original = text;

  output.content = {};

  // 返回消息头部
  if (intent == 'MemoGuide') {
    // 启动创建活动向导
    output.header = {
      version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['S']
    };

    output.content['0'] = {
      processor: 'S',
      option: 'S.AN',
      parameters: {
        an: '开始记录您的备忘,结束记录请说:"结束备忘"'
      }
    };

    // 初始化创建活动向导服务器端上下文
    servercontext['memo'] = {};
  }

  if (intent == 'InputDatetime' || intent == 'InputSomething' || intent == 'InputAddress') {
    var memo = servercontext['memo'] || {};

    if (date && date !== '') {
      memo['d'] = date;
      memo['scd'] = memo['scd'] || {};
      memo['scd']['ds'] = date;
      memo['scd']['de'] = date;
    }

    if (time && time !== '') {
      memo['t'] = time;
      memo['scd'] = memo['scd'] || {};
      memo['scd']['ts'] = time;
      memo['scd']['te'] = time;
    }

    if (address && address !== '') {
      memo['adr'] = address;
      memo['scd'] = memo['scd'] || {};
      memo['scd']['adr'] = address;
    }

    memo['ti'] = (memo['ti']? (memo['ti'] + '\n') : "") + text;
    memo['scd'] = memo['scd'] || {};
    memo['scd']['ti'] = memo['ti'];

    servercontext['memo'] = memo;

    // 输入活动时间/活动内容/活动地址
    output.header = {
      version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['S']
    };

    if (!memo['ti']) {
      output.content['0'] = {
        processor: 'S',
        option: 'S.AN',
        parameters: {
          an: '您需要备忘的内容是什么？'
        }
      };
    } else {
      output.content['0'] = {
        processor: 'S',
        option: 'S.AN',
        parameters: {
          an: '继续备忘，或者说:"结束备忘"结束记录'
        }
      };
    }
  }

  if (intent == 'EndGuide') {
    var memo = servercontext['memo'] || {};

    if (!memo['ti']) {
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['S']
      };

      output.content['0'] = {
        processor: 'S',
        option: 'S.AN',
        parameters: {
          an: '取消备忘'
        }
      };
    } else {
      // 结束向导
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['CA', 'MO', 'SS', 'S']
      };
      output.content['0'] = {
        processor: 'CA',
        option: 'CA.MO',
        parameters: {
          scd: memo['scd']
        }
      };

      output.content['1'] = {
        processor: 'MO',
        option: 'MO.C',
        parameters: {}
      };

      output.content['2'] = {
        processor: 'SS',
        option: 'SS.C',
        parameters: {}
      };

      output.content['3'] = {
        processor: 'S',
        option: 'S.AN',
        parameters: {
          an: '是否保存, 请确认'
        }
      };

      delete servercontext['memo'];
    }
  }

  output.context = {};

  if (clientcontext && clientcontext !== undefined) {
  	output.context['client'] = clientcontext;
  }

  output.context['server'] = servercontext;

  var standardnext = {};

  standardnext.announceTo = [userId + ';' + deviceId];
  standardnext.announceType = 'inteligence_mix';
  standardnext.announceContent = {mwxing:output};

  print(JSON.stringify(standardnext));

  // filter source code here end
  return JSON.stringify(standardnext);
}

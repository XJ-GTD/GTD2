// CREATE_PLANITEM_WITH_GUIDE_V1_5
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

          if (semantic['intent'] === 'PlanItemGuide' || (input['_context'] && input['_context']['server'] && input['_context']['server']['planitem'] && (semantic['intent'] === 'InputDatetime' || semantic['intent'] === 'InputSomething' || semantic['intent'] === 'InputAddress' || semantic['intent'] === 'InputMember' || semantic['intent'] === 'EndGuide'))) {
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
  var intent = 'PlanItemGuide';

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
  if (intent == 'PlanItemGuide') {
    // 启动创建活动向导
    output.header = {
      version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['S']
    };

    output.content['0'] = {
      processor: 'S',
      option: 'S.P',
      parameters: {
        t: 'WHATTOPLANITEM'      // 您要创建的日历项名称是什么？
      }
    };

    // 初始化创建活动向导服务器端上下文
    servercontext['planitem'] = {};
  }

  if (intent == 'InputDatetime' || intent == 'InputSomething' || intent == 'InputAddress') {
    var planitem = servercontext['planitem'] || {};

    if (date && date !== '') {
      planitem['d'] = date;
      planitem['scd'] = planitem['scd'] || {};
      planitem['scd']['ds'] = date;
      planitem['scd']['de'] = date;
    }

    if (time && time !== '') {
      planitem['t'] = time;
      planitem['scd'] = planitem['scd'] || {};
      planitem['scd']['ts'] = time;
      planitem['scd']['te'] = time;
    }

    if (title && title !== '') {
      planitem['ti'] = title;
      planitem['scd'] = planitem['scd'] || {};
      planitem['scd']['ti'] = title;
    }

    if (address && address !== '') {
      planitem['adr'] = address;
      planitem['scd'] = planitem['scd'] || {};
      planitem['scd']['adr'] = address;
    }

    servercontext['planitem'] = planitem;

    // 输入活动时间/活动内容/活动地址
    output.header = {
      version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['S']
    };

    if (!planitem['d'] && !planitem['t'] && !planitem['ti'] && !planitem['adr']) {
      output.content['0'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'WHATTOPLANITEM'      // 日历项名称是什么？
        }
      };
    } else if (!planitem['d'] && !planitem['t']) {
      output.content['0'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'WHENTOPLANITEM'      // 这个日历项在哪天？
        }
      };
    } else if (!planitem['ti']) {
      output.content['0'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'WHATTOPLANITEM'     // 这个日历项叫什么？
        }
      };
    } else {
      // 输入内容满足创建条件
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['CA', 'PI', 'SS', 'S']
      };

      output.content['0'] = {
        processor: 'CA',
        option: 'CA.PI',
        parameters: {
          scd: planitem['scd']
        }
      };

      output.content['1'] = {
        processor: 'PI',
        option: 'PI.C',
        parameters: {}
      };

      output.content['2'] = {
        processor: 'SS',
        option: 'SS.C',
        parameters: {}
      };

      output.content['3'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'EE_PI_CONFIRM'      // 是否创建, 请确认
        }
      };

      delete servercontext['planitem'];
    }
  }

  if (intent == 'EndGuide') {
    var planitem = servercontext['planitem'] || {};

    if (!planitem['d'] && !planitem['t'] && !planitem['ti']) {
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['S']
      };

      output.content['0'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'WHATTOPLANITEM'     // 这个日历项叫什么？
        }
      };
    } else if (!planitem['d'] && !planitem['t']) {
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['S']
      };

      output.content['0'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'WHENTOPLANITEM'     // 这个日历项在哪天？
        }
      };
    } else if (!planitem['ti']) {
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['S']
      };

      output.content['0'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'WHATTOPLANITEM'     // 日历项名称是什么？
        }
      };
    } else {
      // 结束向导
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['CA', 'PI', 'SS', 'S']
      };
      output.content['0'] = {
        processor: 'CA',
        option: 'CA.PI',
        parameters: {
          scd: planitem['scd']
        }
      };

      output.content['1'] = {
        processor: 'PI',
        option: 'PI.C',
        parameters: {}
      };

      output.content['2'] = {
        processor: 'SS',
        option: 'SS.C',
        parameters: {}
      };

      output.content['3'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'EE_PI_CONFIRM'      // 是否创建, 请确认
        }
      };

      delete servercontext['planitem'];
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

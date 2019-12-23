// ADD_REMIND_WITH_AGENDA_V1_5
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

            if (semantic['intent'] === 'AddRemindWithFS') {
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
  var minutes = 0;
  var hours = 0;
  var days = 0;
  var whichtodo = '';
  var lastwhichtodo = '';
  var motion = '';

  var semantics = data['intent']['semantic'];

  for (var sei in semantics) {
    var semantic = semantics[sei];

    motion = semantic['intent'];
    var slots = semantic['slots'];

    for (var si in slots) {
      var slot = slots[si];

      // 取出涉及按秒计时
      if (slot['name'] === 'days') {
        days = slot['normValue'];
      }

      // 取出涉及按分钟计时
      if (slot['name'] === 'minutes') {
        minutes = slot['normValue'];
      }

      // 取出涉及按小时计时
      if (slot['name'] === 'hours') {
        hours = slot['normValue'];
      }

      // 取出涉及上下文获取位置
      if (slot['name'] === 'whichtodo') {
        whichtodo = slot['normValue'];
      }

      // 取出涉及上下文获取位置
      if (slot['name'] === 'lastwhichtodo') {
        lastwhichtodo = slot['normValue'];
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
  output.header = {
    version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['SC','F','AG','SS','S','S']
  };

  output.original = text;

  output.content = {};

  // 确认前
  // 获取前序上下文
  output.content['0'] = {
    processor: 'SC',
    option: 'SC.T',
    parameters: {},
    output: {
      agendas: {
        name: 'scd',
        filter: 'function(value) { let whichtodo = ' + (whichtodo? whichtodo : ('-' + (lastwhichtodo? lastwhichtodo : '0'))) + '; if (value && value.length >= (whichtodo > 0? whichtodo : (value.length + whichtodo + 1))) { whichtodo = (whichtodo > 0? whichtodo : (value.length + whichtodo + 1)); return value.slice(whichtodo-1, whichtodo); } else return value; }'
      }
    }
  };

  // 查询联系人指示
  output.content['1'] = {
    processor: 'F',
    option: 'F.C',
    parameters: {
      scd: {},
      fs: contacts
    },
    output: {
      agendas: ""
    }
  };

  if (motion == 'AddRemindWithFS') {
    // 查询修改日程指示
    output.content['2'] = {
      processor: 'AG',
      option: 'AG.U',
      parameters: {
        reminds: [],
        scd: {
          reminds: []
        }
      }
    };

    if (days || hours || minutes) {
      var remind = (days? (days * 24 * 60 * 60) : 0) + (hours? (hours * 60 * 60) : 0) + (minutes? (minutes * 60) : 0);
      output.content['2']['parameters']['reminds'].push(remind);
    }
  }

  // 查询修改日程指示
  output.content['3'] = {
    processor: 'SS',
    option: 'SS.U',
    parameters: {}
  };

  if (motion == 'AddRemindWithFS') {
    // 播报
    output.content['4'] = {
      when: 'function(agendas, showagendas, contacts, branchtype, branchcode) { if (branchtype && branchcode) { return false; } else { return true; }}',
      processor: 'S',
      option: 'S.P',
      parameters: {
        t: 'TM_AGENDA'
      }
    };

    // 播报 无法修改（被共享日程未接受）
    output.content['5'] = {
      when: 'function(agendas, showagendas, contacts, branchtype, branchcode) { if (branchtype && branchtype == "FORBIDDEN" && branchcode) { return true; } else { return false; }}',
      processor: 'S',
      option: 'S.P',
      parameters: {
        t: 'TM_AGENDA'
      },
      input: {
        type: 'function(agendas, showagendas, prvOpt, user, branchtype, branchcode) { return branchcode; }',
        textvariables: [
          {name: 'agendaowner', expression: 'agendas[0].fs.ran', default: '他人'}
        ],
        showagendas: ""
      }
    };

    if (days) {
      output.content['4']['input']['textvariables'].push({name: 'days', value: days + '天'});
    } else {
      output.content['4']['input']['textvariables'].push({name: 'days', value: ''});
    }

    if (hours) {
      output.content['4']['input']['textvariables'].push({name: 'hours', value: hours + '小时'});
    } else {
      output.content['4']['input']['textvariables'].push({name: 'hours', value: ''});
    }

    if (minutes) {
      output.content['4']['input']['textvariables'].push({name: 'minutes', value: minutes + '分钟'});
    } else {
      output.content['4']['input']['textvariables'].push({name: 'minutes', value: ''});
    }
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

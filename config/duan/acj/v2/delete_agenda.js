function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.CancelAgenda' && data['intent']['intentType'] === 'custom' && data['intent']['shouldEndSession']) {
        // 存在意图确认, 意图确认结果返回
        return true;
      } else if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.CancelAgenda' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
        var semantics = data['intent']['semantic'];

        for (var sei in semantics) {
          var semantic = semantics[sei];

          if (semantic['intent'] === 'CancelAll' || semantic['intent'] === 'CancelWithFS' || semantic['intent'] === 'CancelContacts' || semantic['intent'] === 'CancelSomething' || semantic['intent'] === 'CancelMemoWithFS' || semantic['intent'] === 'CancelPIWithFS') {
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
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.CancelAgenda' && dt['intent']['intentType'] === 'custom' && dt['intent']['shouldEndSession']) {
      data = dt;
    } else if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.CancelAgenda' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
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
  var sdate = '';
  var edate = '';
  var time = '';
  var stime = '';
  var etime = '';
  var title = '';
  var motion = '';
  var whichtodo = '';
  var lastwhichtodo = '';

  var semantics = data['intent']['semantic'];

  for (var sei in semantics) {
    var semantic = semantics[sei];

    motion = semantic['intent'];
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

          if (suggestDatetime.indexOf('/') < 0) {
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
            }
          } else {
            // 包含期间
            var suggestDatetimerange = suggestDatetime.split('/');

            // 包含时间 开始
            var reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = suggestDatetimerange[0].match(reg);

            if (r) {
              sdate = r[1] + '/' + r[2] + '/' + r[3];
              //stime = r[4] + ':' + r[5] + ':' + r[6];
              stime = r[4] + ':' + r[5];
            }

            // 没有时间 开始
            var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rd = suggestDatetimerange[0].match(regd);

            if (rd) {
              sdate = rd[1] + '/' + rd[2] + '/' + rd[3];
              stime = '00:00';
            }

            // 包含时间 结束
            var re = suggestDatetimerange[1].match(reg);

            if (re) {
              edate = re[1] + '/' + re[2] + '/' + re[3];
              //etime = re[4] + ':' + re[5] + ':' + re[6];
              etime = re[4] + ':' + re[5];
            }

            // 没有时间 结束
            var rde = suggestDatetimerange[1].match(regd);

            if (rde) {
              edate = rde[1] + '/' + rde[2] + '/' + rde[3];
              etime = '23:59';
            }
          }
        }
      }

      // 取出涉及日程标题
      if (slot['name'] === 'whattodo') {
        title = slot['normValue'];
      }

      // 取出涉及上下文获取位置
      if (slot['name'] === 'whichtodo') {
        whichtodo = slot['normValue'];
      }

      // 取出涉及上下文获取位置
      if (slot['name'] === 'lastwhichtodo') {
        lastwhichtodo = slot['normValue'];
      }
    }
  }

  // 返回消息头部
  if (!shouldEndSession) {
    if (motion !== 'CancelWithFS') {
      // 确认前
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['F', 'AG', 'SS', 'S']
      };
    } else if (motion == 'CancelMemoWithFS') {
      // 确认前
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['F', 'MO', 'SS', 'S']
      };
    } else if (motion == 'CancelPIWithFS') {
      // 确认前
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['F', 'PI', 'SS', 'S']
      };
    } else {
      // 确认前
      output.header = {
        version: 'V1.1',
        sender: 'xunfei',
        datetime: formatDateTime(new Date()),
        describe: ['SC', 'AG', 'SS', 'S']
      };
    }
  } else {
    // 确认后
    output.header = {
      version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['SC', 'O', 'S']
    };
  }

  output.original = text;

  output.content = {};

  if (!shouldEndSession) {
    // 确认前
    if (motion !== 'CancelWithFS') {
      // 查询联系人指示
      output.content['0'] = {
        processor: 'F',
        option: 'F.C',
        parameters: {
          scd: {},
          fs: contacts
        }
      };
    } else if (motion == 'CancelMemoWithFS') {
      // 取得上下文指示
      output.content['0'] = {
        processor: 'SC',
        option: 'SC.T',
        parameters: {
          scd: {},
          fs: contacts
        },
        output: {
          memos: {
            name: 'mod',
            filter: 'function(value) { let whichtodo = ' + (whichtodo? whichtodo : ('-' + (lastwhichtodo? lastwhichtodo : '0'))) + '; if (value && value.length >= (whichtodo > 0? whichtodo : (value.length + whichtodo + 1))) { whichtodo = (whichtodo > 0? whichtodo : (value.length + whichtodo + 1)); return value.slice(whichtodo-1, whichtodo); } else return value; }'
          }
        }
      };
    } else if (motion == 'CancelPIWithFS') {
      // 取得上下文指示
      output.content['0'] = {
        processor: 'SC',
        option: 'SC.T',
        parameters: {
          scd: {},
          fs: contacts
        },
        output: {
          planitems: {
            name: 'pid',
            filter: 'function(value) { let whichtodo = ' + (whichtodo? whichtodo : ('-' + (lastwhichtodo? lastwhichtodo : '0'))) + '; if (value && value.length >= (whichtodo > 0? whichtodo : (value.length + whichtodo + 1))) { whichtodo = (whichtodo > 0? whichtodo : (value.length + whichtodo + 1)); return value.slice(whichtodo-1, whichtodo); } else return value; }'
          }
        }
      };
    } else {
      // 取得上下文指示
      output.content['0'] = {
        processor: 'SC',
        option: 'SC.T',
        parameters: {
          scd: {},
          fs: contacts
        },
        output: {
          agendas: {
            name: 'scd',
            filter: 'function(value) { let whichtodo = ' + (whichtodo? whichtodo : ('-' + (lastwhichtodo? lastwhichtodo : '0'))) + '; if (value && value.length >= (whichtodo > 0? whichtodo : (value.length + whichtodo + 1))) { whichtodo = (whichtodo > 0? whichtodo : (value.length + whichtodo + 1)); return value.slice(whichtodo-1, whichtodo); } else return value; }'
          }
        }
      };
    }

    if (date && date !== '') {
      output['content']['0']['parameters']['scd']['ds'] = date;
      output['content']['0']['parameters']['scd']['de'] = date;
    }

    if (sdate && sdate !== '') {
      output['content']['0']['parameters']['scd']['ds'] = sdate;
    }

    if (edate && edate !== '') {
      output['content']['0']['parameters']['scd']['de'] = edate;
    }

    if (time && time !== '') {
      output['content']['0']['parameters']['scd']['ts'] = time;
      output['content']['0']['parameters']['scd']['te'] = time;
    } else {
      output['content']['0']['parameters']['scd']['ts'] = '00:00';
      output['content']['0']['parameters']['scd']['te'] = '23:59';
    }

    if (stime && stime !== '') {
      output['content']['0']['parameters']['scd']['ts'] = stime;
    } else {
      output['content']['0']['parameters']['scd']['ts'] = '00:00';
    }

    if (etime && etime !== '') {
      output['content']['0']['parameters']['scd']['te'] = etime;
    } else {
      output['content']['0']['parameters']['scd']['te'] = '23:59';
    }

    if (title && title !== '') {
      output['content']['0']['parameters']['scd']['ti'] = title;
    } else {
      output['content']['0']['parameters']['scd']['ti'] = '';
    }

    if (motion == 'CancelMemoWithFS') {
      // 删除日程指示
      output.content['1'] = {
        processor: 'MO',
        option: 'MO.D',
        parameters: {
        }
      };
    } else if (motion == 'CancelPIWithFS') {
      // 删除日程指示
      output.content['1'] = {
        processor: 'PI',
        option: 'PI.D',
        parameters: {
        }
      };
    } else {
      // 删除日程指示
      output.content['1'] = {
        processor: 'AG',
        option: 'AG.D',
        parameters: {
        }
      };
    }

    // 保存上下文指示
    output.content['2'] = {
      processor: 'SS',
      option: 'SS.D',
      parameters: {
      }
    };

    // 播报
    if (motion == 'CancelMemoWithFS') {
      output.content['3'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'MED'
        }
      };
    } else if (motion == 'CancelPIWithFS') {
      output.content['3'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'PED'
        }
      };
    } else {
      output.content['3'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'ED'
        }
      };
    }
  } else {
    // 确认后
    // 删除日程指示
    // 读取上下文指示
    output.content['0'] = {
      processor: 'SC',
      option: 'SC.T',
      parameters: {}
    };

    var confirm = '好的，已取消';

    if (data['intent'] && data['intent']['answer'] && data['intent']['answer']['text']) {
      confirm = data['intent']['answer']['text'];
    }

    if (confirm === '好的，已确认') {
      // 确认
      output.content['1'] = {
        processor: 'O',
        option: 'O.O',
        parameters: {}
      };

      output.content['2'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'CAA'
        },
        input: {
          showagendas: ""
        }
      };
    }

    if (confirm === '好的，已取消') {
      // 取消
      output.content['1'] = {
        processor: 'O',
        option: 'O.C',
        parameters: {}
      };

      output.content['2'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'CBB'
        },
        input: {
          showagendas: ""
        }
      };
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

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

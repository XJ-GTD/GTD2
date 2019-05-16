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
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.AgendaCreate' && data['intent']['intentType'] === 'custom' && data['intent']['shouldEndSession']) {
        // 存在意图确认, 意图确认结果返回
        return true;
      } else if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.AgendaCreate' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
        var semantics = data['intent']['semantic'];

        for (var sei in semantics) {
          var semantic = semantics[sei];

          if (semantic['intent'] === 'MyAgenda' || semantic['intent'] === 'TheirAgenda' || semantic['intent'] === 'WithTheirAgenda') {
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
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.AgendaCreate' && dt['intent']['intentType'] === 'custom' && dt['intent']['shouldEndSession']) {
      data = dt;
    } else if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.AgendaCreate' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
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
  var answer = data['intent']['answer']['text'];
  var text = data['intent']['text'];
  var contacts = new Array();
  var date = '';
  var time = '';
  var title = '';
  
  var semantics = data['intent']['semantic'];
  
  for (var sei in semantics) {
    var semantic = semantics[sei];

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
    }
  }

  var output = {};
  
  // 返回消息头部
  if (!shouldEndSession) {
    // 确认前
    output.header = {
      version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['F', 'SS', 'S']
    };
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
    // 查询联系人指示
    output.content['0'] = {
      processor: 'F',
      option: 'F.C',
      parameters: {
        scd: {},
        fs: contacts
      }
    };
    
    // 创建日程指示
    output.content['1'] = {
      processor: 'SS',
      option: 'SS.C',
      parameters: {
        ti: title,
        scd: {
          ti: title
        }
      }
    };

    if (date && date !== '') {
      output['content']['1']['parameters']['d'] = date;
      output['content']['1']['parameters']['scd']['sd'] = date;
      output['content']['1']['parameters']['scd']['ed'] = date;
    }
    
    if (time && time !== '') {
      output['content']['1']['parameters']['t'] = time;
      output['content']['1']['parameters']['scd']['st'] = time;
      output['content']['1']['parameters']['scd']['et'] = time;
    }
  
    output.content['2'] = {
      processor: 'S',
      option: 'S.P',
      parameters: {
        t: 'EE'
      }
    };
  } else {
    // 确认后
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
          t: 'AA'
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
        option: 'S.P',
        parameters: {
          t: 'BB'
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
  
  print(JSON.stringify(standardnext));
  
  // filter source code here end
  return JSON.stringify(standardnext);
}
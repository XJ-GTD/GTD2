function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;
  
  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.BlackList' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
          var semantics = data['intent']['semantic'];

          for (var sei in semantics) {
            var semantic = semantics[sei];

            if (semantic['intent'] === 'AddByName') {
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
  var data = input.data;
  for (var di in input.data) {
    var dt = input.data[di];
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.BlackList' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
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
  var cmd = '';
  var key = 'UNKNOWN';
  var contacts = new Array();

  var semantics = data['intent']['semantic'];
  
  for (var sei in semantics) {
    var semantic = semantics[sei];

    key = semantic['intent'];
    var slots = semantic['slots'];
    
    for (var si in slots) {
      var slot = slots[si];

      // 取出关联联系人结果
      if (slot['name'] === 'whotodo') {
        contacts.push({n:slot['normValue']});
      }
      
      // 取出涉及日程标题
      if (slot['name'] === 'actioncmd') {
        cmd = slot['normValue'];
      }
    }
  }
  
  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['F','SY','S']
  };
  
  output.original = text;
  
  output.content = {};

  // 查询联系人指示
  output.content['0'] = {
    processor: 'F',
    option: 'F.C',
    parameters: {
      scd: {},
      fs: contacts
    }
  };

  // 黑名单操作指示
  output.content['1'] = {
    processor: 'SY',
    option: 'SY.B',
    parameters: {}
  };
  
  output.context = {};
  
  if (clientcontext && clientcontext !== undefined) {
  	output.context['client'] = clientcontext;
  }
  
  output.content['2'] = {
    processor: 'S',
    option: 'S.P',
    parameters: {
      t: 'BDD'
    },
    input: {
      agendas: "",
      showagendas: ""
    }
  };
  
  var standardnext = {};
  
  standardnext.announceTo = [userId + ';' + deviceId];
  standardnext.announceType = 'inteligence_mix';
  standardnext.announceContent = {mwxing:output};
  
  print(standardnext);
  
  // filter source code here end
  return JSON.stringify(standardnext);
}
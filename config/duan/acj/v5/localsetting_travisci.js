// LOCALSETTING_TRAVISCI_BUILD_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.LocalSetting' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
          var semantics = data['intent']['semantic'];

          for (var sei in semantics) {
            var semantic = semantics[sei];

            if (semantic['intent'] === 'TriggerTravisCIBuild') {
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
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.LocalSetting' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
      data = dt;
    }
  }

  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var text = data['intent']['text'];

  var formatDateTime = function(date) {
      return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  var output = {
    header: {},
    content: {}
  };

  output.original = text;

  var trigger = false;

  // 回复客户端
  output.header = {
    version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['S']
  };

  if (userId == '13585820972') {
    trigger = true;
    output.content['0'] = {
      processor: 'S',
      option: 'S.AN',
      parameters: {
        an: '请求已发出'   // 自动打包指令已发出
      }
    };
  } else {
    output.content['0'] = {
      processor: 'S',
      option: 'S.AN',
      parameters: {
        an: '没有权限发送请求，请向冥王星管理人员申请开放此权限。'   // 自动打包指令已发出
      }
    };
  }

  var standardnext = {};

  standardnext.announceTo = [userId + ';' + deviceId];
  standardnext.announceType = 'inteligence_mix';
  standardnext.announceContent = {mwxing:output};
  if (trigger) {
    standardnext.travisci = true;
  }

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

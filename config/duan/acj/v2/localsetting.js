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

            if (semantic['intent'] === 'SettingVoiceActivation' || semantic['intent'] === 'SettingVoiceBroadcast' || semantic['intent'] === 'SettingVibration' || semantic['intent'] === 'SettingNewMessageAlert') {
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

  var semantics = data['intent']['semantic'];

  for (var sei in semantics) {
    var semantic = semantics[sei];

    key = semantic['intent'];
    var slots = semantic['slots'];

    for (var si in slots) {
      var slot = slots[si];

      // 取出涉及日程标题
      if (slot['name'] === 'actioncmd') {
        cmd = slot['normValue'];
      }
    }
  }

  var docmd = true;

  if (cmd === '打开') {
    docmd = true;
  }

  if (cmd === '关闭') {
    docmd = false;
  }

  if (key === 'SettingVoiceActivation') {
    key = 'H';
  }

  if (key === 'SettingVoiceBroadcast') {
    key = 'B';
  }

  if (key === 'SettingVibration') {
    key = 'Z';
  }

  if (key === 'SettingNewMessageAlert') {
    key = 'T';
  }

  if (key === 'SettingNextBroadcast') {
    key = 'ALIS';
  }

  if (key === 'SettingGuide') {
    key = 'SIP';
  }

  if (key === 'SettingMergedBroadcast') {
    key = 'CBV';
  }

  if (key === 'SettingThemeNight') {
    key = 'THEME_NIGHT';
  }

  if (key === 'SettingThemeDay') {
    key = 'THEME_DAY';
  }

  if (key === 'SettingAutoTodo') {
    key = 'AUTOTODO';
  }

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['SY','S']
  };

  output.original = text;

  output.content = {};

  // 查询联系人指示
  output.content['0'] = {
    processor: 'SY',
    option: 'SY.S',
    parameters: {
      k: key,
      v: docmd
    }
  };

  output.context = {};

  if (clientcontext && clientcontext !== undefined) {
  	output.context['client'] = clientcontext;
  }

  output.content['1'] = {
    processor: 'S',
    option: 'S.P',
    parameters: {
      t: 'DD'
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

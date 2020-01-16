//MWXING_XUNFEI_ERRCHECK_XEC001_V1_3
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1' && input['_context'].productVersion === 'v2') return false;

  if (input.code && input.code !== "0") {
    return true;
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

  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var clientcontext = input['_context']['client'];
  var servercontext = input['_context']['server'];

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  var code = input['code'];
  var desc = input['desc'];

  var event = {
    eventType: "errorNotify",
    event: {
      trigger_time: Date.parse(new Date()),
      trigger_time_fmt: formatDateTime(new Date()),
      output: {
        service: "xunfei",
        code: code,
        message: desc
      }
    }
  };

  //讯飞异常客户通知
  var output = {};

  output.header = {
    version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['S']
  };

  output.original = "";
  output.content = {};

  output.content['0'] = {
    option: 'S.AN',
    parameters: {
      an: '哎哟，语音服务有点小问题，等一下再试哈'
    }
  };

  output.context = {};

  if (clientcontext && clientcontext !== undefined) {
    output.context['client'] = clientcontext;
  }

  event.announceTo = [userId + ';' + deviceId];
  event.announceType = 'inteligence_mix';
  event.announceContent = {mwxing:output};

  print(JSON.stringify(event));

  // filter source code here end
  return JSON.stringify(event);
}

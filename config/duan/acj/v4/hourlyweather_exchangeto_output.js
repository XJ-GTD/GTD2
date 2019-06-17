//MWXING_HOURLYWEATHER_HW002_V1_4
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['weather'] && input['userId'] && input['event'] && !input['deviceId'] && !input['xunfeiyun']) {
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

  var userId = input['userId'];
  var event = input['event'];
  var weather = input['weather'];
  var to = new Array();

  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  to.push(userId);

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['SD']
  };

  output.content = {};

  // 天气预报推送设置
  output.content['0'] = {
    processor: 'SD',
    option: 'SD.S',
    parameters: {
      datas: [
        {
          type: 'weather',
          fordate: event['output']['yyyy'] + '/' + event['output']['MM'] + '/' + event['output']['dd'],
          title: weather['weatherinfo']['weather'],
          desc: '气温 ' + weather['weatherinfo']['temp1'] + '~' + weather['weatherinfo']['temp2'] + '，' + weather['weatherinfo']['WD'] + ' ' + weather['weatherinfo']['WS'] + '，相对湿度 ' + weather['weatherinfo']['SD'],
          ext: weather['weatherinfo'],
          timestamp: event['trigger_time']
        }
      ]
    }
  };

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:{}};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

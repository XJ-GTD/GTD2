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

  var weatherhead = "";
  var weatherbody = "";

  if (weather['weatherinfo'] && weather['weatherinfo']['weather']) {
    weatherhead = weather['weatherinfo']['weather'];
  }

  if (weather['weatherinfo'] && weather['weatherinfo']['temp1'] && weather['weatherinfo']['temp2']) {
    weatherbody += "气温 ";
    weatherbody += weather['weatherinfo']['temp1'];
    weatherbody += "~";
    weatherbody += weather['weatherinfo']['temp2'];
  }

  if (weather['weatherinfo'] && weather['weatherinfo']['WD'] && weather['weatherinfo']['WS']) {
    if (weatherbody) {
      weatherbody += "，";
    }

    weatherbody += weather['weatherinfo']['WD'];
    weatherbody += " ";
    weatherbody += weather['weatherinfo']['WS'];
  }

  if (weather['weatherinfo'] && weather['weatherinfo']['SD']) {
    if (weatherbody) {
      weatherbody += "，";
    }

    weatherbody += "相对湿度 ";
    weatherbody += weather['weatherinfo']['SD'];
  }

  // 天气预报推送设置
  output.content['0'] = {
    processor: 'SD',
    option: 'SD.S',
    parameters: {
      datas: [
        {
          type: 'weather',
          fordate: event['output']['yyyy'] + '/' + event['output']['MM'] + '/' + event['output']['dd'],
          title: weatherhead,
          desc: weatherbody,
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

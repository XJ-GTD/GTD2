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

  var getWeatherHead = function(weatherinfo) {
    if (weatherinfo && weatherinfo['weather']) {
      return weatherinfo['weather'];
    }

    return "";
  }

  var getWearherBody = function(weatherinfo) {
    var weatherbody = "";

    if (weatherinfo && weatherinfo['temp1'] && weatherinfo['temp2']) {
      weatherbody += "气温 ";
      weatherbody += weatherinfo['temp1'];
      weatherbody += "~";
      weatherbody += weatherinfo['temp2'];
    }

    if (weatherinfo && weatherinfo['WD'] && weatherinfo['WS']) {
      if (weatherbody) {
        weatherbody += "，";
      }

      weatherbody += weatherinfo['WD'];
      weatherbody += " ";
      weatherbody += weatherinfo['WS'];
    }

    if (weatherinfo && weatherinfo['SD']) {
      if (weatherbody) {
        weatherbody += "，";
      }

      weatherbody += "相对湿度 ";
      weatherbody += weatherinfo['SD'];
    }

    return weatherbody;
  }

  var exchangeWeatherInfo = function(triggertime, city, cityid, updatetime, data) {
    var weatherinfo = {
      city: city,
      cityid: cityid,
      temp: "",
      WD: "",
      WS: "",
      SD: "",
      AP: "",
      njd: "",
      WSE: "",
      time: "01:00",
      sm: "",
      isRadar: "0",
      Radar: "",
      temp1: "",
      temp2: "",
      weather: "",
      img1: "",
      img2: "",
      ptime: "01:00"
    };

    if (data['wea']) {
      weatherinfo['weather'] = data['wea'];
    }

    if (data['tem1']) {
      weatherinfo['temp2'] = data['tem1'];
    }

    if (data['tem2']) {
      weatherinfo['temp1'] = data['tem2'];
    }

    if (data['tem']) {
      weatherinfo['temp'] = data['tem'];
    }

    if (data['win'] && data['win'].length > 0) {
      for (var windin in data['win']) {
        var wind = data['win'][windin];

        if (weatherinfo['WD']) {
          weatherinfo['WD'] += "、";
        }

        weatherinfo['WD'] += wind;
      }
    }

    if (data['win_speed']) {
      weatherinfo['WS'] = data['win_speed'];
    }

    if (updatetime && updatetime.indexOf(data['date']) >= 0) {
      weatherinfo['time'] = updatetime.substring(11, 16);
      weatherinfo['ptime'] = updatetime.substring(11, 16);
    }

    var weatherhead = getWeatherHead(weatherinfo);
    var weatherbody = getWearherBody(weatherinfo);

    var output = {
      type: 'weather',
      fordate: data['date'].replace(/-/g, "/"),
      title: weatherhead,
      desc: weatherbody,
      ext: weatherinfo,
      timestamp: triggertime
    }

    return output;
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

  var weatherhead = getWeatherHead(weather['weatherinfo']);
  var weatherbody = getWearherBody(weather['weatherinfo']);

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

  if (weather['sevendays'] && weather['sevendays']['data'] && weather['sevendays']['data'].length > 0) {
    //去除中国天气网接口获取数据
    output.content['0']['parameters']['datas'].shift();

    for (var oneday in weather['sevendays']['data']) {
      var onedayweather = weather['sevendays']['data'][oneday];

      output.content['0']['parameters']['datas'].push(exchangeWeatherInfo(
        event['trigger_time'],
        weather['weatherinfo']['city'],
        weather['weatherinfo']['cityid'],
        weather['sevendays']['update_time'],
        onedayweather));
    }
  }

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:{}};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

//MWXING_FIRIM_EVENTS_WEBHOOK001_V1_4
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['userId'] && input['event'] && (input['webhook'] == 'fir.im') && !input['location'] && !input['deviceId'] && !input['xunfeiyun']) {
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

  var output = {};
  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  var userId = input['userId'];
  var event = input['event'];
  var sharefrom = event['output']['payload']['from'];

  var to = new Array();
  to.push(userId);

  var push = {};
  if (event['output']['payload']['changelog']) {
    push = {
      title: event['output']['payload']['name'] + '' + event['output']['payload']['version'] + ' (build:' + event['output']['payload']['build'] + ')',
      content: event['output']['payload']['changelog'],
      extras: {
        event: "MWXING_NOTIFICATION_EVENT",
        dependson: "on.homepage.init",
        eventhandler: "on.urlopen.message.click",
        eventdatafrom: "server",
        eventdata: JSON.stringify({url: event['output']['payload']['link']})
      }
    };
  } else {
    push = {
      title: event['output']['payload']['name'],
      content: event['output']['payload']['msg'],
      extras: {
        event: "MWXING_NOTIFICATION_EVENT",
        dependson: "on.homepage.init",
        eventhandler: "on.urlopen.message.click",
        eventdatafrom: "server",
        eventdata: JSON.stringify({url: event['output']['payload']['link']})
      }
    };
  }

  //收到应用发布消息的时候，通知客户端保存应用实例
  if (event['output']['payload']['changelog'] && !sharefrom) {
    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['SY']
    };

    output.content = {};

    // 保存项目跟进实例数据指示
    output.content['0'] = {
      processor: 'SY',
      option: 'SY.FO',
      parameters: {
        t: 'FOFIR_INS',
        tn: 'fir.im应用',
        k: event['output']['payload']['link'],
        kn: event['output']['payload']['name'],
        vs: JSON.stringify(event['output']['payload'])
      }
    };
  }

  //收到其他用户共享应用发布消息的时候，通知被共享客户端保存应用实例
  if (event['output']['payload']['changelog'] && sharefrom) {
    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['SY']
    };

    output.content = {};

    // 保存项目跟进实例数据指示
    output.content['0'] = {
      processor: 'SY',
      option: 'SY.FO',
      parameters: {
        t: 'FOFIRIN_INS',
        tn: 'fir.im应用',
        k: event['output']['payload']['link'],
        kn: event['output']['payload']['name'],
        vs: JSON.stringify(event['output']['payload'])
      }
    };
  }

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:{},push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

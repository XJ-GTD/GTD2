//MWXING_DAILYSUMMARY_DR001_V1_2
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['userId'] && input['event'] && !input['deviceId'] && !input['xunfeiyun']) {
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
  var to = new Array();

  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  to.push(userId);

  var today = new Date();

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(today),
    describe: ['PN']
  };

  output.content = {};

  // 日程共享操作类型设置
  output.content['0'] = {
    processor: 'PN',
    option: 'PN.DR',
    parameters: {
      timestamp: event['trigger_time']
    }
  };

  var push = {
    title: '每日简报',
    content: (today.getMonth()+1) + '月' + today.getDate() + '日 ' + ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][today.getDay()],
    extras: {
      event: "MWXING_DAILYSUMMARY_EVENT",
      eventId: "on.dailyreport.message.click",
      eventData: JSON.stringify(output.content['0']['parameters'])
    }
  };

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:{},push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

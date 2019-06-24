//MWXING_MAINTAIN_NOTIFICATION_MN001_V1_3
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['eventType'] && input['event']) {
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

  var eventType = input['eventType'];
  var event = input['event'];
  var to = new Array();

  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  to.push("13585820972");
  to.push("15821947260");
  to.push("13661617252");

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['PN']
  };

  output.content = {};

  // 日程共享操作类型设置
  output.content['0'] = {
    processor: 'PN',
    option: 'PN.FB',
    parameters: {
      timestamp: event['trigger_time'],
      title: "讯飞发生异常@" + event['trigger_time_fmt'],
      text: event['output']['code'] + ": " + event['output']['message'],
      reason: eventType,
      scd: {}
    }
  };

  var push = {
    title: "讯飞发生异常@" + event['trigger_time_fmt'],
    content: event['output']['code'] + ": " + event['output']['message']
  };


  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:{},sms:{},push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

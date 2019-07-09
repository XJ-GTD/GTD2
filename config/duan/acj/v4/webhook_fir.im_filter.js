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

  var userId = input['userId'];
  var event = input['event'];

  var to = new Array();
  to.push(userId);

  var push = {
    title: event['output']['payload']['platform'] + ' ' + event['output']['payload']['msg'] + ' 已更新',
    content: event['output']['payload']['link'],
    extras: {
      event: "MWXING_DAILYSUMMARY_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.dailyreport.message.click",
      eventdatafrom: "server",
      eventdata: JSON.stringify({})
    }
  };

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:{},sms:{},push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

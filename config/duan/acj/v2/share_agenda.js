function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['from'] && input['to'] && input['agenda'] && input['notifyType']) {

    if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

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

  var from = input['from'];
  var to = new Array();
  var agenda = input['agenda'];
  var notifyType = input['notifyType'];

  var output = {};

  var formatDateTime = function(date) {
      return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  var formatDateTimeShow = function(date) {
    if (date.indexOf('99:99') < 0) {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日 ' + date.substring(11,16);
    } else {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日';
    }
  }

  var names = [];

  if (input['to'] && input['to'].length > 0) {
    for (var id in input['to']) {
      var contacts = input['to'][id];
      to.push(contacts['mpn']);
    }
  }

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['SH']
  };

  output.content = {};

  // 日程共享操作类型设置
  output.content['0'] = {
    processor: 'SH',
    option: 'SH.C',
    parameters: {
      id: agenda['ai']
    }
  };

  var push = {};

  if (notifyType === 'add') {
    output.content['0']['option'] = 'SH.C';
    push['title'] = '##from##共享了' + agenda['at'];
  }

  if (notifyType === 'update') {
    output.content['0']['option'] = 'SH.U';
    push['title'] = '##from##更新了' + agenda['at'];
  }

  if (notifyType === 'delete') {
    output.content['0']['option'] = 'SH.D';
  }

  // 设置未注册用户短信通知模板
  var sms = {template: {
    newuser: '11lnk',
    name: '冥王星用户',
    title: agenda['at'],
    url: 'http://u3v.cn/4sUKl3'
  }};

  if (push['title']) {
    push['content'] = formatDateTimeShow(agenda['adt']);
    push['extras'] = {
      event: "MWXING_SHAREAGENDA_EVENT",
      dependson: "on.agendashare.saved",
      eventhandler: "on.agendashare.message.click",
      eventdatafrom: "local",
      eventdata: JSON.stringify(output['content']['0']['parameters'])
    };
  }

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:sms,push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

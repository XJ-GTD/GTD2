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
    return (date.getMonth()+1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes();
  }

  var names = [];

  if (input['to'] && input['to'].length > 0) {
    for (var id in input['to']) {
      var contacts = input['to'][id];
      to.push(contacts['mpn']);
    }
  }

  var adt = new Date();

  if (agenda['adt']) {
    adt = new Date(agenda['adt'].split(' ').join('T'));
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

  if (notifyType === 'add') {
    output.content['0']['option'] = 'SH.C';
  }

  if (notifyType === 'update') {
    output.content['0']['option'] = 'SH.U';
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

  var push = {
    title: '##from##共享了' + agenda['at'],
    content: formatDateTimeShow(adt),
    extras: {
      event: "MWXING_SHAREAGENDA_EVENT",
      eventhandler: "on.agendashare.message.click",
      eventdata: JSON.stringify(output)
    }
  };

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:{},sms:sms,push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}

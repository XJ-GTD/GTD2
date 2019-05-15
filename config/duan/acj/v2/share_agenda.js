function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;
  
  if (input !== undefined && input['from'] && input['to'] && input['agenda'] && input['notifyType']) {
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
    return date.getFullYear() + '/' + date.getMonth()+1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
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
  
  var standardnext = {};
  
  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:sms};
  
  print(standardnext);
  
  // filter source code here end
  return JSON.stringify(standardnext);
}
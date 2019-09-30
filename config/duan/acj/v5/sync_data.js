function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['name'] && input['from'] && input['to'] && input['header'] && input['datas']) {

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

  var name = input['name'];
  var from = input['from'];
  var to = input['to'];
  var copyto = input['copyto'];
  var header = input['header'];
  var datas = input['datas'];

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

  var sms;

  // 判断发送对象是否未注册
  if (!copyto || !copyto.openid) {
    // 设置未注册用户短信通知模板
    sms = {template: {
      newuser: '11lnk',
      name: '冥王星用户',
      title: agenda['at'],
      url: 'http://u3v.cn/4sUKl3'
    }};
  } else {
    
  }
}

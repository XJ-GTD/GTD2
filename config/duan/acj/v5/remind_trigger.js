// MWXING_SCHEDULED_REMIND_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['datas']) {

    return true;
  }

  // filter source code here end
  return false;
}

/**
 * 触发计划提醒
 * 转换提醒格式给推送服务
 **/
function clean(datasource)
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var userId = input['userId'];
  var datas = input['datas'];

  var formatDateTime = function(date) {
      return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  }

  var formatDateTimeShow = function(date) {
    if (date.indexOf('99:99') < 0) {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日 ' + date.substring(11,16);
    } else {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日';
    }
  }

  var convertPushMessage = function(id, type, title, datetime) {
    var push = {};

    push['title'] = '活动提醒';
    push['content'] = title;
    push['extras'] = {
      event: "MWXING_SHAREAGENDA_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.agendashare.message.click",
      eventdatafrom: "local",
      eventdata: JSON.stringify({type: type, id: id})
    };

    return push;
  }

  var outputs = [];

  for (var index in datas) {
    var data = datas[index];

    var to = data['exchangeno'];
    var id = data['id'];
    var type = data['type'];
    var title = data['title'];
    var datetime = formatDateTime(new Date());

    var standardnext = {};

    standardnext.announceTo = [to];
    standardnext.announceType = 'data_sync';
    standardnext.announceContent = {
      mwxing: {},
      sms: {},
      push: convertPushMessage(id, type, title, datetime)
    };

    outputs.push(standardnext);

  }

  print({announces: outputs});

  // filter source code here end
  return JSON.stringify({announces: outputs});
}

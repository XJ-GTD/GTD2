// MWXING_DATASYNC_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['from'] && input['header'] && input['datas']) {

    return true;
  }

  // filter source code here end
  return false;
}

/**
 * 本帐号本设备/多设备同步
 * 他帐号数据共享
 **/
function clean(datasource)
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var from = input['from'];
  var to = input['to'];
  var copyto = input['copyto'];
  var header = input['header'];
  var datas = input['datas'];

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

  var convertSMS = function(title) {
    var sms;

    // 设置未注册用户短信通知模板
    sms = {template: {
      newuser: '11lnk',
      name: '冥王星用户',
      title: title,
      url: 'http://u3v.cn/4sUKl3'
    }};

  }

  var convertPushMessage = function(id, type, title, datetime) {
    var push = {};

    push['title'] = '[##from##] ' + title;
    push['content'] = formatDateTimeShow(datetime);
    push['extras'] = {
      event: "MWXING_SHAREAGENDA_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.agendashare.message.click",
      eventdatafrom: "local",
      eventdata: JSON.stringify({type: type, id: id})
    };
  }

  // messagetype: SD[SELF_DEVICE], SA[SELF_ACCOUNT], OA[OTHER_ACCOUNT]
  var convertMessage = function(id, type, title, messagetype) {
    var output = {};

    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['DS']
    };

    output.content = {};

    // 日程共享操作类型设置
    output.content['0'] = {
      processor: 'DS',
      parameters: {
        type: type,
        id: id
      }
    };

    if (messagetype == 'SELF_DEVICE') output.content['0']['option'] = 'DS.SD';
    if (messagetype == 'SELF_ACCOUNT') output.content['0']['option'] = 'DS.SA';
    if (messagetype == 'OTHER_ACCOUNT') output.content['0']['option'] = 'DS.OA';

    return output;
  }

  var convertDataMessage = function(id, type, status, members, payload) {
    var output = {};

    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['DS']
    };

    output.content = {};

    // 日程共享操作类型设置
    output.content['0'] = {
      processor: 'DS',
      option: 'DS.DS',
      parameters: {
        type: type,
        id: id,
        status: status,
        to: members,
        data: payload
      }
    };

    return output;
  }

  var outputs = [];
  var requestdevice = header['di'];

  // 逐条处理
  if (to) { // 同步/推送通知
    for (var index in datas) {
      var data = datas[index];

      var src = data['src'];
      var id = data['id'];
      var type = data['type'];
      var todevice = data['todevice'];
      var title = data['title'];
      var datetime = data['datetime'];
      var main = data['main'];

      // 本帐户同步
      if (from == to) {
        // 请求设备同步
        if (requestdevice == todevice) {
          var standardnext = {};

          standardnext.announceTo = [to];
          standardnext.announceDevice = todevice;
          standardnext.announceType = 'data_sync';
          standardnext.announceContent = {
            mwxing: convertMessage(id, type, title, 'SELF_DEVICE'),
            sms: {},
            push: {}
          };

          outputs.push(standardnext);
        } else {  // 他设备同步
          var standardnext = {};

          standardnext.announceTo = [to];
          standardnext.announceDevice = todevice;
          standardnext.announceType = 'data_sync';
          standardnext.announceContent = {
            mwxing: convertMessage(id, type, title, 'SELF_ACCOUNT'),
            sms: {},
            push: {}
          };

          outputs.push(standardnext);
        }
      } else {  // 他账户共享
        var standardnext = {};

        standardnext.announceTo = [to];
        standardnext.announceDevice = todevice;
        standardnext.announceType = 'data_sync';
        standardnext.announceContent = {
          mwxing: convertMessage(id, type, title, 'OTHER_ACCOUNT'),
          sms: convertSMS(title),
          push: convertPushMessage(id, type, title, datetime)
        };

        outputs.push(standardnext);
      }
    }
  } else {  // 推送数据
    for (var index in datas) {
      var data = datas[index];

      var id = data['id'];
      var type = data['type'];
      var status = data['status'];
      var payload = data['payload'];
      var members = data['to'];

      var standardnext = {};

      standardnext.announceTo = [from];
      standardnext.announceDevice = requestdevice;
      standardnext.announceType = 'data_sync';
      standardnext.announceContent = {
        mwxing: convertDataMessage(id, type, status, members, payload),
        sms: {},
        push: {}
      };

      outputs.push(standardnext);
    }
  }

  print({announces: outputs});

  // filter source code here end
  return JSON.stringify({announces: outputs});
}
